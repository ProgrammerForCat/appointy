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
    
    const body = await readBody(event)
    
    // バリデーション
    if (!body.name || body.name.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: '名前は必須です'
      })
    }
    
    if (!body.email || body.email.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'メールアドレスは必須です'
      })
    }
    
    // プロフィール更新
    execute(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [body.name.trim(), body.email.trim(), body.phone?.trim() || null, authUser.userId]
    )
    
    // レスポンス
    return {
      success: true,
      message: 'プロフィールを更新しました'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール更新エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})