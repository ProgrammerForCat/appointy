import { ReservationSchema } from '~/server/utils/validation'
import { execute, queryOne, query } from '~/server/database'
import { getBusinessHours, isWithinBusinessHours } from '~/server/utils/business-hours'
import type { Service, User } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // バリデーション
    const validation = ReservationSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { service_id, customer_name, customer_email, start_time } = validation.data
    
    // サービス情報を取得
    const service = queryOne(
      'SELECT * FROM services WHERE id = ? AND is_active = 1',
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
    
    // オーナーの営業時間を取得
    const owner = queryOne(
      'SELECT business_hours FROM users WHERE id = ?',
      [service.user_id]
    ) as Pick<User, 'business_hours'> | undefined
    
    if (!owner) {
      throw createError({
        statusCode: 404,
        statusMessage: 'オーナーが見つかりません'
      })
    }
    
    const businessHours = getBusinessHours(owner.business_hours)
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
      'INSERT INTO reservations (service_id, customer_name, customer_email, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
      [service_id, customer_name, customer_email, startTime.toISOString(), endTime.toISOString()]
    )
    
    // 作成された予約を返す
    setResponseStatus(event, 201)
    return {
      id: result.lastInsertRowid,
      serviceId: service_id,
      customerName: customer_name,
      customerEmail: customer_email,
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