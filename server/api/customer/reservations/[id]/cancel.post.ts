import { requireAuth } from '~/server/utils/auth'
import { execute, queryOne } from '~/server/database'
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
    
    const reservationId = getRouterParam(event, 'id')
    
    // 予約が存在し、自分の予約か確認
    const reservation = queryOne(
      'SELECT * FROM reservations WHERE id = ? AND customer_id = ?',
      [reservationId, authUser.userId]
    ) as Reservation | undefined
    
    if (!reservation) {
      throw createError({
        statusCode: 404,
        statusMessage: '予約が見つかりません'
      })
    }
    
    // 既にキャンセルされているかチェック
    if (reservation.status === 'cancelled') {
      throw createError({
        statusCode: 400,
        statusMessage: 'この予約は既にキャンセルされています'
      })
    }
    
    // キャンセル可能な時間かチェック（24時間前まで）
    const now = new Date()
    const reservationTime = new Date(reservation.start_time)
    const hoursDiff = (reservationTime - now) / (1000 * 60 * 60)
    
    if (hoursDiff <= 24) {
      throw createError({
        statusCode: 400,
        statusMessage: '予約の24時間前を過ぎているため、キャンセルできません'
      })
    }
    
    // 予約をキャンセル状態に更新
    execute(
      'UPDATE reservations SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
      ['cancelled', reservationId]
    )
    
    return {
      message: '予約をキャンセルしました'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約キャンセルエラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})