import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { execute, queryOne } from '~/server/database'
import { generateToken, generateUUID } from '~/server/utils/auth'

const CustomerRegisterSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // バリデーション
    const validation = CustomerRegisterSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, email, password } = validation.data
    
    // メールアドレスの重複チェック
    const existingUser = queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'このメールアドレスは既に登録されています'
      })
    }
    
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // ユーザーを作成
    const userId = generateUUID()
    execute(
      'INSERT INTO users (id, name, email, hashed_password) VALUES (?, ?, ?, ?)',
      [userId, name, email, hashedPassword]
    )
    
    // JWTトークンを生成
    const token = generateToken({
      userId,
      email
    })
    
    // Cookieにトークンを設定
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日
    })
    
    // レスポンス
    setResponseStatus(event, 201)
    return {
      success: true,
      message: 'アカウントが作成されました',
      user: {
        id: userId,
        name,
        email
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('カスタマー登録エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})