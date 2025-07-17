import { requireAuth } from '~/server/utils/auth'
import { queryAll, queryOne } from '~/server/database'
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

    const reservationId = getRouterParam(event, 'id')
    if (!reservationId) {
      throw createError({
        statusCode: 400,
        message: '予約IDが必要です'
      })
    }

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

    // 権限チェック（顧客または店舗所有者）
    const isCustomer = reservation.customer_id === authUser.userId
    let isOwner = false
    
    if (!isCustomer) {
      const store = queryOne(
        'SELECT * FROM stores WHERE user_id = ? AND id = ?',
        [authUser.userId, reservation.store_id]
      ) as Store | undefined
      
      isOwner = !!store
    }

    if (!isCustomer && !isOwner) {
      throw createError({
        statusCode: 403,
        message: 'この予約への権限がありません'
      })
    }

    // メッセージを取得
    const messages = queryAll(
      `SELECT rm.*, u.name as sender_name
       FROM reservation_messages rm
       JOIN users u ON rm.sender_id = u.id
       WHERE rm.reservation_id = ?
       ORDER BY rm.created_at ASC`,
      [reservationId]
    )

    return {
      reservationId: parseInt(reservationId),
      messages: messages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderType: msg.sender_type,
        message: msg.message,
        createdAt: msg.created_at
      }))
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    console.error('メッセージ取得エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'サーバーエラーが発生しました'
    })
  }
})