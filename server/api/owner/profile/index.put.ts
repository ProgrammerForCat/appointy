import { requireAuth } from '~/server/utils/auth'
import { ProfileUpdateSchema } from '~/server/utils/validation'
import { execute, queryOne } from '~/server/database'
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
    
    const body = await readBody(event)
    
    // バリデーション
    const validation = ProfileUpdateSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, description, business_hours } = validation.data
    
    // 更新するフィールドを構築
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    if (name !== undefined) {
      updateFields.push('name = ?')
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
        statusMessage: '更新するフィールドがありません'
      })
    }
    
    // ユーザーIDを最後に追加
    updateValues.push(authUser.userId)
    
    // プロフィールを更新
    execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )
    
    // 更新されたユーザー情報を取得
    const updatedUser = queryOne(
      'SELECT * FROM users WHERE id = ?',
      [authUser.userId]
    ) as User
    
    // business_hoursをパース
    let businessHours: BusinessHours | undefined
    if (updatedUser.business_hours) {
      try {
        businessHours = JSON.parse(updatedUser.business_hours)
      } catch (error) {
        console.error('営業時間のパースエラー:', error)
      }
    }
    
    // レスポンス
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      description: updatedUser.description,
      profileImageUrl: updatedUser.profile_image_key 
        ? `${process.env.R2_PUBLIC_URL || '/uploads'}/${updatedUser.profile_image_key}`
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
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})