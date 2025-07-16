import { queryOne } from '~/server/database'
import type { Service } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const serviceId = getRouterParam(event, 'id')
    
    if (!serviceId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'サービスIDが必要です'
      })
    }
    
    // サービス詳細を取得（店舗情報も含む）
    const serviceData = queryOne(
      `SELECT 
        s.id,
        s.name,
        s.price,
        s.duration_minutes,
        s.category,
        s.is_active,
        s.store_id,
        st.store_name,
        st.description as store_description,
        st.business_hours
      FROM services s
      JOIN stores st ON s.store_id = st.id
      WHERE s.id = ? AND s.is_active = 1`,
      [serviceId]
    ) as any
    
    if (!serviceData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'サービスが見つかりません'
      })
    }
    
    // service と store を分離
    const service = {
      id: serviceData.id,
      name: serviceData.name,
      price: serviceData.price,
      durationMinutes: serviceData.duration_minutes,
      category: serviceData.category,
      store_id: serviceData.store_id
    }
    
    const store = {
      id: serviceData.store_id,
      name: serviceData.store_name,
      description: serviceData.store_description,
      business_hours: serviceData.business_hours
    }
    
    return {
      service,
      store
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス詳細取得エラー:', error)
    console.error('Error details:', error.message, error.stack)
    throw createError({
      statusCode: 500,
      statusMessage: `サーバーエラーが発生しました: ${error.message}`
    })
  }
})