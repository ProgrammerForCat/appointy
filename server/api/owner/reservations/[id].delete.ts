import { requireAuth } from '~/server/utils/auth'
import { execute, queryOne } from '~/server/database'
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
    
    const reservationId = getRouterParam(event, 'id')
    
    // 予約が存在し、所有者が正しいか確認
    const existingReservation = queryOne(`
      SELECT r.*
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.id = ? AND s.store_id = ?
    `, [reservationId, store.id]) as Reservation | undefined
    
    if (!existingReservation) {
      throw createError({
        statusCode: 404,
        statusMessage: '予約が見つかりません'
      })
    }
    
    // 予約をキャンセル状態に更新
    execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      ['cancelled', reservationId]
    )
    
    // 204 No Content
    setResponseStatus(event, 204)
    return null
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