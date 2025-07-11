import { queryOne } from '~/server/database'
import type { Store, BusinessHours } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 最初の店舗を取得（シングルテナント想定）
    const store = queryOne(
      'SELECT * FROM stores ORDER BY created_at ASC LIMIT 1',
      []
    ) as Store | undefined
    
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: '店舗が見つかりません'
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
      name: store.store_name,
      description: store.description,
      profileImageUrl: store.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || '/uploads'}/${store.profile_image_key}`
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