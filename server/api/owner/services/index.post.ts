import { requireAuth } from '~/server/utils/auth'
import { ServiceSchema } from '~/server/utils/validation'
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
    
    const body = await readBody(event)
    
    // バリデーション
    const validation = ServiceSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: validation.error.issues
      })
    }
    
    const { name, duration_minutes, price, is_active = true } = validation.data
    
    // サービスを作成
    const result = execute(
      'INSERT INTO services (user_id, name, duration_minutes, price, is_active) VALUES (?, ?, ?, ?, ?)',
      [authUser.userId, name, duration_minutes, price, is_active]
    )
    
    // 作成されたサービスを返す
    return {
      id: result.lastInsertRowid,
      userId: authUser.userId,
      name,
      durationMinutes: duration_minutes,
      price,
      isActive: is_active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス作成エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})