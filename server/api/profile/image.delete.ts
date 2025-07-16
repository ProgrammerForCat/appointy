import { requireAuth } from '~/server/utils/auth'
import { execute, queryOne } from '~/server/database'
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
    
    // 現在のユーザー情報を取得
    const user = queryOne(
      'SELECT profile_image_key FROM users WHERE id = ?',
      [authUser.userId]
    ) as User | undefined
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'ユーザーが見つかりません'
      })
    }
    
    // 画像キーがある場合はS3/MinIOから削除
    if (user.profile_image_key) {
      try {
        // AWS SDKを動的インポート
        const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3').then(m => m)
        
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
        
        // MinIOから画像を削除
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET || 'appointy',
          Key: user.profile_image_key
        })
        
        await s3Client.send(deleteCommand)
      } catch (s3Error) {
        // S3削除エラーはログに出力するが、処理は続行
        console.error('S3画像削除エラー:', s3Error)
      }
    }
    
    // データベースから画像キーを削除
    execute(
      'UPDATE users SET profile_image_key = NULL WHERE id = ?',
      [authUser.userId]
    )
    
    // レスポンス
    return {
      success: true,
      message: 'プロフィール画像を削除しました'
    }
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