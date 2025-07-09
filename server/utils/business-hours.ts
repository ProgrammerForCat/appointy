import type { BusinessHours } from './types'

// 営業時間を取得
export function getBusinessHours(businessHoursJson: string | null): BusinessHours | null {
  if (!businessHoursJson) return null
  
  try {
    return JSON.parse(businessHoursJson)
  } catch (error) {
    console.error('営業時間のパースエラー:', error)
    return null
  }
}

// 指定日の営業時間を取得
export function getBusinessHourForDate(businessHours: BusinessHours, date: Date) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = dayNames[date.getDay()] as keyof BusinessHours
  return businessHours[dayName]
}

// 営業時間内かどうかを判定
export function isWithinBusinessHours(
  businessHours: BusinessHours,
  startTime: Date,
  endTime: Date
): boolean {
  const startHour = getBusinessHourForDate(businessHours, startTime)
  const endHour = getBusinessHourForDate(businessHours, endTime)
  
  // 開始日と終了日が異なる場合は営業時間外
  if (startTime.toDateString() !== endTime.toDateString()) {
    return false
  }
  
  // 休業日の場合
  if (!startHour?.isOpen || !endHour?.isOpen) {
    return false
  }
  
  // 営業時間の文字列を分割
  const [startHourStr, startMinuteStr] = startHour.openTime!.split(':')
  const [endHourStr, endMinuteStr] = startHour.closeTime!.split(':')
  
  // その日の営業開始時刻と終了時刻を作成
  const businessStart = new Date(startTime)
  businessStart.setHours(parseInt(startHourStr), parseInt(startMinuteStr), 0, 0)
  
  const businessEnd = new Date(startTime)
  businessEnd.setHours(parseInt(endHourStr), parseInt(endMinuteStr), 0, 0)
  
  // 営業時間内かどうかを判定
  return startTime >= businessStart && endTime <= businessEnd
}

// 予約可能な時間枠を生成
export function generateAvailableSlots(
  businessHours: BusinessHours,
  date: Date,
  durationMinutes: number,
  existingReservations: { start_time: string; end_time: string }[]
): { startTime: string; endTime: string; available: boolean }[] {
  const slots: { startTime: string; endTime: string; available: boolean }[] = []
  
  const dayHour = getBusinessHourForDate(businessHours, date)
  
  // 休業日の場合
  if (!dayHour?.isOpen || !dayHour.openTime || !dayHour.closeTime) {
    return slots
  }
  
  // 営業時間を取得
  const [startHourStr, startMinuteStr] = dayHour.openTime.split(':')
  const [endHourStr, endMinuteStr] = dayHour.closeTime.split(':')
  
  const businessStart = new Date(date)
  businessStart.setHours(parseInt(startHourStr), parseInt(startMinuteStr), 0, 0)
  
  const businessEnd = new Date(date)
  businessEnd.setHours(parseInt(endHourStr), parseInt(endMinuteStr), 0, 0)
  
  // 30分間隔で時間枠を生成
  const current = new Date(businessStart)
  while (current < businessEnd) {
    const slotEnd = new Date(current)
    slotEnd.setMinutes(current.getMinutes() + durationMinutes)
    
    // 営業時間内に収まるかチェック
    if (slotEnd <= businessEnd) {
      const startTime = current.toISOString()
      const endTime = slotEnd.toISOString()
      
      // 既存の予約と重複しているかチェック
      const isAvailable = !existingReservations.some(reservation => {
        const reservationStart = new Date(reservation.start_time)
        const reservationEnd = new Date(reservation.end_time)
        
        // 重複判定
        return (current < reservationEnd && slotEnd > reservationStart)
      })
      
      slots.push({
        startTime,
        endTime,
        available: isAvailable
      })
    }
    
    // 30分進める
    current.setMinutes(current.getMinutes() + 30)
  }
  
  return slots
}