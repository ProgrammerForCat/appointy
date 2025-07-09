import { requireAuth } from '~/server/utils/auth'
import { query } from '~/server/database'
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
    
    // サービス一覧を取得
    const services = query(
      'SELECT * FROM services WHERE user_id = ? ORDER BY created_at DESC',
      [authUser.userId]
    ) as Service[]
    
    // レスポンス
    return {
      services: services.map(service => ({
        id: service.id,
        userId: service.user_id,
        name: service.name,
        durationMinutes: service.duration_minutes,
        price: service.price,
        isActive: service.is_active,
        createdAt: service.created_at,
        updatedAt: service.updated_at
      }))
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス一覧取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})