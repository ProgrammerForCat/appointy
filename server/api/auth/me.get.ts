import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { User, Store } from '~/server/utils/types'

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
    
    // ユーザー情報を取得
    const user = queryOne(
      'SELECT * FROM users WHERE id = ?',
      [authUser.userId]
    ) as User | undefined
    
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'ユーザーが見つかりません'
      })
    }
    
    // 店舗情報を取得（あれば）
    const store = queryOne(
      'SELECT * FROM stores WHERE user_id = ?',
      [user.id]
    ) as Store | undefined
    
    // レスポンス
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImageUrl: user.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${user.profile_image_key}`
        : null,
      hasStore: !!store,
      store: store ? {
        id: store.id,
        storeName: store.store_name,
        description: store.description,
        profileImageUrl: store.profile_image_key 
          ? `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${store.profile_image_key}`
          : null
      } : null
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('ユーザー情報取得エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'サーバーエラーが発生しました'
    })
  }
})