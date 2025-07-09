import { requireAuth } from '~/server/utils/auth'
import { query } from '~/server/database'
import type { Reservation } from '~/server/utils/types'

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
    
    // クエリパラメータを取得
    const queryParams = getQuery(event)
    const startDate = queryParams.startDate as string
    const endDate = queryParams.endDate as string
    
    // 基本クエリ
    let sql = `
      SELECT r.*, s.name as service_name
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE s.user_id = ?
    `
    const params = [authUser.userId]
    
    // 日付フィルター
    if (startDate) {
      sql += ' AND DATE(r.start_time) >= ?'
      params.push(startDate)
    }
    if (endDate) {
      sql += ' AND DATE(r.start_time) <= ?'
      params.push(endDate)
    }
    
    sql += ' ORDER BY r.start_time DESC'
    
    // 予約一覧を取得
    const reservations = query(sql, params) as (Reservation & { service_name: string })[]
    
    // レスポンス
    return {
      reservations: reservations.map(reservation => ({
        id: reservation.id,
        serviceId: reservation.service_id,
        serviceName: reservation.service_name,
        customerName: reservation.customer_name,
        customerEmail: reservation.customer_email,
        startTime: reservation.start_time,
        endTime: reservation.end_time,
        status: reservation.status,
        createdAt: reservation.created_at
      }))
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約一覧取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})