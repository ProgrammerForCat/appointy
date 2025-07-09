import { requireAuth, generateUUID } from '~/server/utils/auth'
import { ProfileImageSchema } from '~/server/utils/validation'

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
    const validation = ProfileImageSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { content_type } = validation.data
    
    // 画像キーを生成
    const fileExtension = content_type.split('/')[1]
    const imageKey = `user-${authUser.userId}-${generateUUID()}.${fileExtension}`
    
    // 開発環境ではローカルパスを返す
    // 本番環境ではCloudflare R2の署名付きURLを生成する必要がある
    const uploadUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.R2_UPLOAD_URL}/${imageKey}?signature=mock`
      : `/uploads/${imageKey}`
    
    // レスポンス
    return {
      uploadUrl,
      imageKey
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('画像アップロードURL生成エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})