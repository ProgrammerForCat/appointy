import { requireAuth } from '~/server/utils/auth'
import { execute, queryOne } from '~/server/database'
import type { Service } from '~/server/utils/types'

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
    
    const serviceId = getRouterParam(event, 'id')
    
    // サービスが存在し、所有者が正しいか確認
    const existingService = queryOne(
      'SELECT * FROM services WHERE id = ? AND user_id = ?',
      [serviceId, authUser.userId]
    ) as Service | undefined
    
    if (!existingService) {
      throw createError({
        statusCode: 404,
        statusMessage: 'サービスが見つかりません'
      })
    }
    
    // サービスを削除
    execute(
      'DELETE FROM services WHERE id = ? AND user_id = ?',
      [serviceId, authUser.userId]
    )
    
    // 204 No Content
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('サービス削除エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})