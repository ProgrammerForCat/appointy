import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { User, BusinessHours } from '~/server/utils/types'

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
    
    // ユーザープロフィールを取得
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
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImageUrl: user.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${user.profile_image_key}`
        : null,
      businessHours
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})