import { requireAuth } from '~/server/utils/auth'
import { execute } from '~/server/database'
import { z } from 'zod'

const ImageKeySchema = z.object({
  imageKey: z.string().min(1, '画像キーは必須です')
})

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
    const validation = ImageKeySchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { imageKey } = validation.data
    
    // プロフィール画像キーを更新
    execute(
      'UPDATE users SET profile_image_key = ? WHERE id = ?',
      [imageKey, authUser.userId]
    )
    
    // レスポンス
    return {
      profileImageUrl: `${process.env.R2_PUBLIC_URL || '/uploads'}/${imageKey}`
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール画像登録エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})