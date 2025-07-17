import { requireAuth } from '~/server/utils/auth'
import { query, queryOne } from '~/server/database'
import type { Reservation, Store } from '~/server/utils/types'

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
    
    // ユーザーの店舗を取得
    const store = queryOne(
      'SELECT id FROM stores WHERE user_id = ?',
      [authUser.userId]
    ) as Store | undefined
    
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: '店舗が見つかりません'
      })
    }
    
    // クエリパラメータを取得
    const queryParams = getQuery(event)
    const startDate = queryParams.startDate as string
    const endDate = queryParams.endDate as string
    const status = queryParams.status as string
    const date = queryParams.date as string
    
    // 基本クエリ - usersテーブルから顧客情報を取得
    let sql = `
      SELECT r.*, s.name as service_name, u.name as customer_name, u.email as customer_email
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      JOIN users u ON r.customer_id = u.id
      WHERE s.store_id = ?
    `
    const params = [store.id]
    
    // 日付フィルター
    if (startDate) {
      sql += ' AND DATE(r.start_time) >= ?'
      params.push(startDate)
    }
    if (endDate) {
      sql += ' AND DATE(r.start_time) <= ?'
      params.push(endDate)
    }
    
    // ステータスフィルター
    if (status) {
      sql += ' AND r.status = ?'
      params.push(status)
    }
    
    // 日付フィルター（単一日）
    if (date) {
      sql += ' AND DATE(r.start_time) = ?'
      params.push(date)
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
        customerName: reservation.customer_name || reservation.customer_email,
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