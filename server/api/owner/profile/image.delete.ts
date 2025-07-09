import { requireAuth } from '~/server/utils/auth'
import { execute } from '~/server/database'

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
    
    // プロフィール画像キーを削除
    execute(
      'UPDATE users SET profile_image_key = NULL WHERE id = ?',
      [authUser.userId]
    )
    
    // 204 No Content
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール画像削除エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})