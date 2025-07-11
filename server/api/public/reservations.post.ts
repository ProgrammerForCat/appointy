import { requireAuth } from '~/server/utils/auth'
import { execute, queryOne, query } from '~/server/database'
import { getBusinessHours, isWithinBusinessHours } from '~/server/utils/business-hours'
import type { Service, Store } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 認証を確認
    const authUser = await requireAuth(event)
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: '予約には認証が必要です'
      })
    }
    
    const body = await readBody(event)
    
    // バリデーション
    if (!body.service_id || !body.start_time) {
      throw createError({
        statusCode: 400,
        statusMessage: 'サービスIDと開始時刻は必須です'
      })
    }
    
    const { service_id, start_time } = body
    
    // サービス情報を取得
    const service = queryOne(
      `SELECT s.* FROM services s 
       JOIN stores st ON s.store_id = st.id 
       WHERE s.id = ? AND s.is_active = 1`,
      [service_id]
    ) as Service | undefined
    
    if (!service) {
      throw createError({
        statusCode: 404,
        statusMessage: 'サービスが見つかりません'
      })
    }
    
    // 終了時刻を計算
    const startTime = new Date(start_time)
    const endTime = new Date(startTime)
    endTime.setMinutes(startTime.getMinutes() + service.duration_minutes)
    
    // 店舗の営業時間を取得
    const store = queryOne(
      'SELECT business_hours FROM stores WHERE id = ?',
      [service.store_id]
    ) as Pick<Store, 'business_hours'> | undefined
    
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: '店舗が見つかりません'
      })
    }
    
    const businessHours = getBusinessHours(store.business_hours)
    if (!businessHours) {
      throw createError({
        statusCode: 400,
        statusMessage: '営業時間が設定されていません'
      })
    }
    
    // 営業時間内かどうかをチェック
    if (!isWithinBusinessHours(businessHours, startTime, endTime)) {
      throw createError({
        statusCode: 400,
        statusMessage: '営業時間外です'
      })
    }
    
    // 時間の重複をチェック
    const conflictingReservations = query(
      'SELECT * FROM reservations WHERE service_id = ? AND status = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))',
      [service_id, 'confirmed', endTime.toISOString(), startTime.toISOString(), startTime.toISOString(), endTime.toISOString()]
    )
    
    if (conflictingReservations.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: '指定の時間は既に予約されています'
      })
    }
    
    // 予約を作成
    const result = execute(
      'INSERT INTO reservations (service_id, customer_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [service_id, authUser.userId, startTime.toISOString(), endTime.toISOString()]
    )
    
    // 作成された予約を返す
    setResponseStatus(event, 201)
    return {
      id: result.lastInsertRowid,
      serviceId: service_id,
      customerId: authUser.userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      message: '予約が完了しました'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('予約作成エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})