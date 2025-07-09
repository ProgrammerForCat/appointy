import { queryOne, query } from '~/server/database'
import { getBusinessHours, generateAvailableSlots } from '~/server/utils/business-hours'
import type { Service, User } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const serviceId = parseInt(queryParams.serviceId as string)
    const dateStr = queryParams.date as string
    
    // バリデーション
    if (!serviceId || !dateStr) {
      throw createError({
        statusCode: 400,
        statusMessage: 'サービスIDと日付は必須です'
      })
    }
    
    // 日付の形式チェック
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: '無効な日付形式です'
      })
    }
    
    // サービス情報を取得
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
    
    // オーナーの営業時間を取得
    const owner = queryOne(
      'SELECT business_hours FROM users WHERE id = ?',
      [service.user_id]
    ) as Pick<User, 'business_hours'> | undefined
    
    if (!owner) {
      throw createError({
        statusCode: 404,
        statusMessage: 'オーナーが見つかりません'
      })
    }
    
    const businessHours = getBusinessHours(owner.business_hours)
    if (!businessHours) {
      throw createError({
        statusCode: 400,
        statusMessage: '営業時間が設定されていません'
      })
    }
    
    // 指定日の既存予約を取得
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    const existingReservations = query(
      'SELECT start_time, end_time FROM reservations WHERE service_id = ? AND start_time >= ? AND start_time < ? AND status = ?',
      [serviceId, startOfDay.toISOString(), endOfDay.toISOString(), 'confirmed']
    ) as { start_time: string; end_time: string }[]
    
    // 予約可能な時間枠を生成
    const slots = generateAvailableSlots(
      businessHours,
      date,
      service.duration_minutes,
      existingReservations
    )
    
    // レスポンス
    return {
      slots
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約可能時間取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})