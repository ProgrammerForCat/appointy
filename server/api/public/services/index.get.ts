import { query } from '~/server/database'
import type { Service } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 全店舗の有効なサービス一覧を取得
    const services = query(
      `SELECT s.*, st.store_name, st.description as store_description
       FROM services s 
       JOIN stores st ON s.store_id = st.id 
       WHERE (s.is_active = 1 OR s.is_active = 'true' OR s.is_active = 'True')
       ORDER BY st.created_at ASC, s.created_at ASC`,
      []
    ) as (Service & { store_name: string; store_description: string })[]
    
    // レスポンス
    return {
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        category: service.category || 'その他',
        durationMinutes: service.duration_minutes,
        price: service.price,
        storeId: service.store_id,
        storeName: service.store_name,
        storeDescription: service.store_description
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