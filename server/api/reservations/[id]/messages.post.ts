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

    const reservationId = getRouterParam(event, 'id')
    if (!reservationId) {
      throw createError({
        statusCode: 400,
        message: '予約IDが必要です'
      })
    }

    // リクエストボディを取得
    const body = await readBody(event)
    if (!body.message || body.message.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'メッセージが必要です'
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
    let senderType = 'customer'
    
    if (!isCustomer) {
      const store = queryOne(
        'SELECT * FROM stores WHERE user_id = ? AND id = ?',
        [authUser.userId, reservation.store_id]
      ) as Store | undefined
      
      isOwner = !!store
      senderType = 'owner'
    }

    if (!isCustomer && !isOwner) {
      throw createError({
        statusCode: 403,
        message: 'この予約への権限がありません'
      })
    }

    // メッセージを保存
    const result = execute(
      'INSERT INTO reservation_messages (reservation_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
      [reservationId, authUser.userId, senderType, body.message.trim()]
    )

    // 作成されたメッセージを取得
    const message = queryOne(
      `SELECT rm.*, u.name as sender_name
       FROM reservation_messages rm
       JOIN users u ON rm.sender_id = u.id
       WHERE rm.id = ?`,
      [result.lastInsertRowid]
    )

    return {
      id: message.id,
      senderId: message.sender_id,
      senderName: message.sender_name,
      senderType: message.sender_type,
      message: message.message,
      createdAt: message.created_at
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    console.error('メッセージ送信エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'サーバーエラーが発生しました'
    })
  }
})