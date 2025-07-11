import { RegisterSchema } from '~/server/utils/validation'
import { queryOne, execute } from '~/server/database'
import { hashPassword, generateToken, generateUUID } from '~/server/utils/auth'
import type { User } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // バリデーション
    const validation = RegisterSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, email, password } = validation.data
    
    // 既存ユーザーチェック
    const existingUser = queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as User | undefined
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'このメールアドレスは既に登録されています'
      })
    }
    
    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password)
    
    // ユーザーを作成
    const userId = generateUUID()
    execute(
      `INSERT INTO users (id, name, email, hashed_password, created_at, updated_at) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [userId, name, email, hashedPassword]
    )
    
    // JWTトークンを生成
    const token = generateToken({
      userId,
      email
    })
    
    // HTTPOnly Cookieにトークンを設定
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7日間
    })
    
    // レスポンス
    return {
      user: {
        id: userId,
        name,
        email,
        hasStore: false,
        store: null
      }
    }
  } catch (error) {
    // エラーハンドリング
    if (error.statusCode) {
      throw error
    }
    
    console.error('ユーザー登録エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})