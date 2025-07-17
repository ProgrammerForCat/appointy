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
        message: '認証が必要です'
      })
    }

    // 店舗情報を取得
    const store = queryOne(
      'SELECT * FROM stores WHERE user_id = ?',
      [authUser.userId]
    ) as Store | undefined

    if (!store) {
      throw createError({
        statusCode: 404,
        message: '店舗が見つかりません'
      })
    }

    const reservationId = getRouterParam(event, 'id')
    if (!reservationId) {
      throw createError({
        statusCode: 400,
        message: '予約IDが必要です'
      })
    }

    // リクエストボディを取得
    const body = await readBody(event)
    const rejectionReason = body.reason || '店舗都合によりキャンセル'

    // 予約を取得して権限チェック
    const reservation = queryOne(
      `SELECT r.*, s.store_id 
       FROM reservations r 
       JOIN services s ON r.service_id = s.id 
       WHERE r.id = ?`,
      [reservationId]
    ) as (Reservation & { store_id: number }) | undefined

    if (!reservation) {
      throw createError({
        statusCode: 404,
        message: '予約が見つかりません'
      })
    }

    // 店舗所有者権限チェック
    if (reservation.store_id !== store.id) {
      throw createError({
        statusCode: 403,
        message: 'この予約への権限がありません'
      })
    }

    // 既にキャンセル済みの場合はエラー
    if (reservation.status === 'cancelled') {
      throw createError({
        statusCode: 400,
        message: '既にキャンセル済みの予約です'
      })
    }

    // 予約を拒否（キャンセル）
    execute(
      'UPDATE reservations SET status = ?, notes = ? WHERE id = ?',
      ['cancelled', rejectionReason, reservationId]
    )

    // 更新された予約を返す
    const updatedReservation = queryOne(
      'SELECT * FROM reservations WHERE id = ?',
      [reservationId]
    ) as Reservation

    return {
      ...updatedReservation,
      message: '予約を拒否しました'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    console.error('予約拒否エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'サーバーエラーが発生しました'
    })
  }
})