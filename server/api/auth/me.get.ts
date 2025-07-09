import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { User } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 認証を確認
    const authUser = await requireAuth(event)
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: '認証が必要です'
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
        statusMessage: 'ユーザーが見つかりません'
      })
    }
    
    // レスポンス
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || '/uploads'}/${user.profile_image_key}`
        : null
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('ユーザー情報取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})