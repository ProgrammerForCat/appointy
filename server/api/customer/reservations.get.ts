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
    const status = queryParams.status as string
    const limit = parseInt(queryParams.limit as string) || 50
    const offset = parseInt(queryParams.offset as string) || 0
    
    // 基本クエリ
    let sql = `
      SELECT r.*, s.name as service_name, s.duration_minutes, s.price,
             st.store_name, st.description as store_description
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      JOIN stores st ON s.store_id = st.id
      WHERE r.customer_id = ?
    `
    const params = [authUser.userId]
    
    // ステータスフィルター
    if (status && ['confirmed', 'cancelled'].includes(status)) {
      sql += ' AND r.status = ?'
      params.push(status)
    }
    
    sql += ' ORDER BY r.start_time DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    // 予約履歴を取得
    const reservations = query(sql, params) as (Reservation & { 
      service_name: string
      duration_minutes: number
      price: number
      store_name: string
      store_description: string
    })[]
    
    // レスポンス
    return {
      reservations: reservations.map(reservation => ({
        id: reservation.id,
        serviceId: reservation.service_id,
        serviceName: reservation.service_name,
        durationMinutes: reservation.duration_minutes,
        price: reservation.price,
        storeName: reservation.store_name,
        storeDescription: reservation.store_description,
        startTime: reservation.start_time,
        endTime: reservation.end_time,
        status: reservation.status,
        createdAt: reservation.created_at
      })),
      meta: {
        limit,
        offset,
        total: reservations.length
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約履歴取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})