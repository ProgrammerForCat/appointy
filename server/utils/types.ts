// 型定義ファイル

export interface User {
  id: string
  name: string
  email: string
  hashed_password: string
  created_at: string
  updated_at: string
}

export interface Store {
  id: string
  user_id: string
  store_name: string
  description?: string
  profile_image_key?: string
  business_hours?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  store_id: string
  name: string
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: number
  service_id: number
  customer_id: string
  start_time: string
  end_time: string
  status: 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface BusinessHour {
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
}

export interface BusinessHours {
  monday: BusinessHour
  tuesday: BusinessHour
  wednesday: BusinessHour
  thursday: BusinessHour
  friday: BusinessHour
  saturday: BusinessHour
  sunday: BusinessHour
}

export interface JWTPayload {
  userId: string
  email: string
  exp: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
}