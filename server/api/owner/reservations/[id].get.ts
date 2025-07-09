import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { Reservation, Service } from '~/server/utils/types'

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
    
    const reservationId = getRouterParam(event, 'id')
    
    // 予約詳細を取得
    const reservation = queryOne(`
      SELECT r.*, s.name as service_name, s.duration_minutes, s.price
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.id = ? AND s.user_id = ?
    `, [reservationId, authUser.userId]) as (Reservation & { 
      service_name: string
      duration_minutes: number
      price: number
    }) | undefined
    
    if (!reservation) {
      throw createError({
        statusCode: 404,
        statusMessage: '予約が見つかりません'
      })
    }
    
    // レスポンス
    return {
      id: reservation.id,
      serviceId: reservation.service_id,
      customerName: reservation.customer_name,
      customerEmail: reservation.customer_email,
      startTime: reservation.start_time,
      endTime: reservation.end_time,
      status: reservation.status,
      createdAt: reservation.created_at,
      service: {
        id: reservation.service_id,
        name: reservation.service_name,
        durationMinutes: reservation.duration_minutes,
        price: reservation.price
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約詳細取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})