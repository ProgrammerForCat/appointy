import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { queryOne } from '~/server/database'
import { generateToken } from '~/server/utils/auth'
import type { User } from '~/server/utils/types'

const CustomerLoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // バリデーション
    const validation = CustomerLoginSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { email, password } = validation.data
    
    // ユーザーを取得
    const user = queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as User | undefined
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'メールアドレスまたはパスワードが間違っています'
      })
    }
    
    // パスワードを検証
    const isValidPassword = await bcrypt.compare(password, user.hashed_password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'メールアドレスまたはパスワードが間違っています'
      })
    }
    
    // JWTトークンを生成
    const token = generateToken({
      userId: user.id,
      email: user.email
    })
    
    // Cookieにトークンを設定
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日
    })
    
    // レスポンス
    return {
      success: true,
      message: 'ログインしました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('カスタマーログインエラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})