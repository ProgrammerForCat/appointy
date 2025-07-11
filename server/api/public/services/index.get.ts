import { query } from '~/server/database'
import type { Service } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 有効なサービス一覧を取得（最初の店舗のサービス）
    const services = query(
      `SELECT s.* FROM services s 
       JOIN stores st ON s.store_id = st.id 
       WHERE s.is_active = 1 
       ORDER BY s.created_at ASC`,
      []
    ) as Service[]
    
    // レスポンス
    return {
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        durationMinutes: service.duration_minutes,
        price: service.price
      }))
    }
  } catch (error) {
    console.error('サービス一覧取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})