import { requireAuth } from '~/server/utils/auth'
import { queryOne } from '~/server/database'
import type { Store, BusinessHours } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 認証を確認
    const authUser = await requireAuth(event)
    console.log('認証ユーザー:', authUser)
    if (!authUser) {
      throw createError({
        statusCode: 401,
        message: '認証が必要です'
      })
    }
    
    // 店舗プロフィールを取得（user_idベースで）
    const store = queryOne(
      'SELECT * FROM stores WHERE user_id = ?',
      [authUser.userId]
    ) as Store | undefined
    
    if (!store) {
      throw createError({
        statusCode: 404,
        message: '店舗が見つかりません'
      })
    }
    
    // business_hoursをパース
    let businessHours: BusinessHours | undefined
    if (store.business_hours) {
      try {
        businessHours = JSON.parse(store.business_hours)
      } catch (error) {
        console.error('営業時間のパースエラー:', error)
      }
    }
    
    // レスポンス
    return {
      id: store.id,
      name: store.store_name,
      description: store.description,
      profileImageUrl: store.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || 'http://localhost:9000/appointy'}/${store.profile_image_key}`
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
      message: 'サーバーエラーが発生しました'
    })
  }
})