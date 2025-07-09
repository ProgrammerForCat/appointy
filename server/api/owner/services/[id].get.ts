import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { Service } from '~/server/utils/types'

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
    
    const serviceId = getRouterParam(event, 'id')
    
    // サービスを取得
    const service = queryOne(
      'SELECT * FROM services WHERE id = ? AND user_id = ?',
      [serviceId, authUser.userId]
    ) as Service | undefined
    
    if (!service) {
      throw createError({
        statusCode: 404,
        statusMessage: 'サービスが見つかりません'
      })
    }
    
    // レスポンス
    return {
      id: service.id,
      userId: service.user_id,
      name: service.name,
      durationMinutes: service.duration_minutes,
      price: service.price,
      isActive: service.is_active,
      createdAt: service.created_at,
      updatedAt: service.updated_at
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})