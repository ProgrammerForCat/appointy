import { z } from 'zod'

// 認証用のバリデーション
export const LoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください')
})

// サービス用のバリデーション
export const ServiceSchema = z.object({
  name: z.string().min(1, 'サービス名は必須です'),
  duration_minutes: z.number().min(1, '所要時間は1分以上で入力してください'),
  price: z.number().min(0, '料金は0円以上で入力してください'),
  is_active: z.boolean().optional()
})

// 予約用のバリデーション
export const ReservationSchema = z.object({
  service_id: z.union([
    z.number(),
    z.string().transform((val) => parseInt(val, 10))
  ]).refine((val) => !isNaN(val) && val > 0, 'サービスIDは必須です'),
  customer_name: z.string().min(1, '顧客名は必須です'),
  customer_email: z.string().email('有効なメールアドレスを入力してください'),
  start_time: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, '有効な日時を入力してください')
})

// プロフィール用のバリデーション
export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, '名前は必須です').optional(),
  description: z.string().optional(),
  business_hours: z.record(z.object({
    isOpen: z.boolean(),
    openTime: z.string().nullable(),
    closeTime: z.string().nullable()
  })).optional()
})

// プロフィール画像用のバリデーション
export const ProfileImageSchema = z.object({
  content_type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'サポートされていない画像形式です' })
  })
})

// バリデーション結果の型
export type ValidationResult<T> = {
  success: boolean
  data?: T
  error?: string
}