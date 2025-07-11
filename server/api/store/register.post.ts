import { requireAuth, generateUUID } from '~/server/utils/auth'
import { queryOne, execute } from '~/server/database'
import type { Store } from '~/server/utils/types'

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
    
    // 既に店舗を持っているかチェック
    const existingStore = queryOne(
      'SELECT id FROM stores WHERE user_id = ?',
      [authUser.userId]
    ) as Store | undefined
    
    if (existingStore) {
      throw createError({
        statusCode: 409,
        statusMessage: '既に店舗を登録済みです'
      })
    }
    
    const body = await readBody(event)
    
    // バリデーション
    if (!body.storeName || body.storeName.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: '店舗名は必須です'
      })
    }
    
    // 店舗を作成
    const storeId = generateUUID()
    const businessHours = JSON.stringify({
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: false, openTime: null, closeTime: null },
      sunday: { isOpen: false, openTime: null, closeTime: null }
    })
    
    execute(
      `INSERT INTO stores (id, user_id, store_name, description, business_hours, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        storeId,
        authUser.userId,
        body.storeName.trim(),
        body.description || '',
        businessHours
      ]
    )
    
    // デフォルトサービスを作成（オプション）
    if (body.createDefaultServices) {
      const defaultServices = [
        { name: '30分相談', duration: 30, price: 3000 },
        { name: '60分相談', duration: 60, price: 5000 },
        { name: '90分相談', duration: 90, price: 7000 }
      ]
      
      for (const service of defaultServices) {
        execute(
          'INSERT INTO services (store_id, name, duration_minutes, price, is_active) VALUES (?, ?, ?, ?, ?)',
          [storeId, service.name, service.duration, service.price, true]
        )
      }
    }
    
    // レスポンス
    return {
      store: {
        id: storeId,
        storeName: body.storeName.trim(),
        description: body.description || '',
        businessHours: JSON.parse(businessHours)
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('店舗登録エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})