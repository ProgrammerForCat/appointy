import { requireAuth } from '~/server/utils/auth'
import { ServiceSchema } from '~/server/utils/validation'
import { execute, queryOne } from '~/server/database'
import type { Service, Store } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 認証を確認
    const authUser = await requireAuth(event)
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: '認証が必要です'
      })
    }
    
    // ユーザーの店舗を取得
    const store = queryOne(
      'SELECT id FROM stores WHERE user_id = ?',
      [authUser.userId]
    ) as Store | undefined
    
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: '店舗が見つかりません'
      })
    }
    
    const serviceId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // バリデーション
    const validation = ServiceSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, duration_minutes, price, is_active = true } = validation.data
    
    // サービスが存在し、所有者が正しいか確認
    const existingService = queryOne(
      'SELECT * FROM services WHERE id = ? AND store_id = ?',
      [serviceId, store.id]
    ) as Service | undefined
    
    if (!existingService) {
      throw createError({
        statusCode: 404,
        statusMessage: 'サービスが見つかりません'
      })
    }
    
    // サービスを更新
    execute(
      'UPDATE services SET name = ?, duration_minutes = ?, price = ?, is_active = ? WHERE id = ? AND store_id = ?',
      [name, duration_minutes, price, is_active, serviceId, store.id]
    )
    
    // 更新されたサービスを返す
    return {
      id: parseInt(serviceId),
      storeId: store.id,
      name,
      durationMinutes: duration_minutes,
      price,
      isActive: is_active,
      createdAt: existingService.created_at,
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス更新エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})