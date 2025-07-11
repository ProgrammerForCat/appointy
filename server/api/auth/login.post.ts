import { LoginSchema } from '~/server/utils/validation'
import { queryOne } from '~/server/database'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import type { User, Store } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // バリデーション
    const validation = LoginSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { email, password } = validation.data
    
    // ユーザーを検索
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
    const isValidPassword = await verifyPassword(password, user.hashed_password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'メールアドレスまたはパスワードが間違っています'
      })
    }
    
    // 店舗情報を取得（あれば）
    const store = queryOne(
      'SELECT * FROM stores WHERE user_id = ?',
      [user.id]
    ) as Store | undefined
    
    // JWTトークンを生成
    const token = generateToken({
      userId: user.id,
      email: user.email
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
        id: user.id,
        name: user.name,
        email: user.email,
        hasStore: !!store,
        store: store ? {
          id: store.id,
          storeName: store.store_name,
          description: store.description,
          profileImageUrl: store.profile_image_key 
            ? `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${store.profile_image_key}`
            : null
        } : null
      },
      token
    }
  } catch (error) {
    // エラーハンドリング
    if (error.statusCode) {
      throw error
    }
    
    console.error('ログインエラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})