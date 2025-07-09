import { queryOne } from '~/server/database'
import type { User, BusinessHours } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 最初のユーザーを取得（シングルテナント想定）
    const user = queryOne(
      'SELECT * FROM users ORDER BY created_at ASC LIMIT 1',
      []
    ) as User | undefined
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: '店舗が見つかりません'
      })
    }
    
    // business_hoursをパース
    let businessHours: BusinessHours | undefined
    if (user.business_hours) {
      try {
        businessHours = JSON.parse(user.business_hours)
      } catch (error) {
        console.error('営業時間のパースエラー:', error)
      }
    }
    
    // レスポンス
    return {
      name: user.name,
      description: user.description,
      profileImageUrl: user.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || '/uploads'}/${user.profile_image_key}`
        : null,
      businessHours
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('店舗プロフィール取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})