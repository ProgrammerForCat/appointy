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
    
    // FormDataを読み取り
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '画像ファイルが見つかりません'
      })
    }
    
    const imageFile = formData.find(field => field.name === 'image')
    if (!imageFile) {
      throw createError({
        statusCode: 400,
        statusMessage: '画像ファイルが見つかりません'
      })
    }
    
    // ファイル形式チェック
    if (!imageFile.type || !imageFile.type.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: '画像ファイルのみアップロード可能です'
      })
    }
    
    // ファイルサイズチェック（5MB）
    if (imageFile.data.length > 5 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ファイルサイズは5MB以下にしてください'
      })
    }
    
    // 画像キーを生成
    const fileExtension = imageFile.type.split('/')[1]
    const timestamp = Date.now()
    const imageKey = `profile-${authUser.userId}-${timestamp}.${fileExtension}`
    
    // AWS SDKを動的インポート
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3').then(m => m)
    
    // S3/MinIOクライアントを設定
    const s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
      region: 'auto',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
      },
      forcePathStyle: true
    })
    
    // MinIOに画像をアップロード
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || 'appointy',
      Key: imageKey,
      Body: imageFile.data,
      ContentType: imageFile.type
    })
    
    await s3Client.send(uploadCommand)
    
    // データベースに画像キーを保存
    execute(
      'UPDATE users SET profile_image_key = ? WHERE id = ?',
      [imageKey, authUser.userId]
    )
    
    const imageUrl = `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${imageKey}`
    
    // レスポンス
    return {
      imageUrl,
      imageKey
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール画像アップロードエラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})