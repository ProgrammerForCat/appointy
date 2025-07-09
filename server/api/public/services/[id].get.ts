import { queryOne } from '~/server/database'
import type { Service } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const serviceId = getRouterParam(event, 'id')
    
    // サービス詳細を取得
    const service = queryOne(
      'SELECT * FROM services WHERE id = ? AND is_active = 1',
      [serviceId]
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
      name: service.name,
      durationMinutes: service.duration_minutes,
      price: service.price
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス詳細取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})