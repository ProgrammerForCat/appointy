import { requireAuth } from '~/server/utils/auth'
import { ProfileUpdateSchema } from '~/server/utils/validation'
import { execute, queryOne } from '~/server/database'
import type { Store, BusinessHours } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // 認証を確認
    const authUser = await requireAuth(event)
    if (!authUser) {
      throw createError({
        statusCode: 401,
        message: '認証が必要です'
      })
    }
    
    // 店舗情報を取得
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
    
    const body = await readBody(event)
    
    // バリデーション
    const validation = ProfileUpdateSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, description, business_hours } = validation.data
    
    // 更新するフィールドを構築
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    if (name !== undefined) {
      updateFields.push('store_name = ?')
      updateValues.push(name)
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(description)
    }
    
    if (business_hours !== undefined) {
      updateFields.push('business_hours = ?')
      updateValues.push(JSON.stringify(business_hours))
    }
    
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: '更新するフィールドがありません'
      })
    }
    
    // 店舗IDを最後に追加
    updateValues.push(store.id)
    
    // プロフィールを更新
    execute(
      `UPDATE stores SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )
    
    // 更新された店舗情報を取得
    const updatedStore = queryOne(
      'SELECT * FROM stores WHERE id = ?',
      [store.id]
    ) as Store
    
    // business_hoursをパース
    let businessHours: BusinessHours | undefined
    if (updatedStore.business_hours) {
      try {
        businessHours = JSON.parse(updatedStore.business_hours)
      } catch (error) {
        console.error('営業時間のパースエラー:', error)
      }
    }
    
    // レスポンス
    return {
      id: updatedStore.id,
      name: updatedStore.store_name,
      description: updatedStore.description,
      profileImageUrl: updatedStore.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || '/uploads'}/${updatedStore.profile_image_key}`
        : null,
      businessHours
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('プロフィール更新エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'サーバーエラーが発生しました'
    })
  }
})