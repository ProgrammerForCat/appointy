// サンプルデータ挿入用のユーティリティ
import { execute, queryOne } from '../database'
import { hashPassword, generateUUID } from './auth'

export async function insertSampleData() {
  try {
    // 既存のユーザーがいるかチェック
    const existingUser = queryOne('SELECT * FROM users LIMIT 1', [])
    if (existingUser) {
      console.log('既存のユーザーが存在するため、サンプルデータの挿入をスキップします')
      return
    }
    
    // サンプルユーザーを作成（店舗オーナー）
    const userId = generateUUID()
    const storeId = generateUUID()
    const hashedPassword = await hashPassword('password123')
    
    // ユーザー登録
    execute(
      'INSERT INTO users (id, name, email, hashed_password) VALUES (?, ?, ?, ?)',
      [userId, '田中太郎', 'owner@example.com', hashedPassword]
    )
    
    // 店舗登録
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
      'INSERT INTO stores (id, user_id, store_name, description, business_hours) VALUES (?, ?, ?, ?, ?)',
      [storeId, userId, '田中太郎カウンセリングルーム', '10年以上の経験を持つカウンセラーです。心の悩みから人生相談まで幅広く対応いたします。', businessHours]
    )
    
    // サンプルサービスを作成
    const services = [
      { name: '60分カウンセリング', duration: 60, price: 5000 },
      { name: '90分カウンセリング', duration: 90, price: 7500 },
      { name: '初回相談（30分）', duration: 30, price: 3000 }
    ]
    
    for (const service of services) {
      execute(
        'INSERT INTO services (store_id, name, duration_minutes, price) VALUES (?, ?, ?, ?)',
        [storeId, service.name, service.duration, service.price]
      )
    }
    
    // サンプル顧客ユーザーを作成
    const customerId = generateUUID()
    const customerPassword = await hashPassword('password123')
    
    execute(
      'INSERT INTO users (id, name, email, hashed_password) VALUES (?, ?, ?, ?)',
      [customerId, '山田花子', 'customer@example.com', customerPassword]
    )
    
    console.log('サンプルデータが正常に挿入されました')
    console.log('店舗オーナー: owner@example.com / password123')
    console.log('顧客ユーザー: customer@example.com / password123')
  } catch (error) {
    console.error('サンプルデータの挿入エラー:', error)
  }
}

// 開発環境でのみサンプルデータを挿入
if (process.env.NODE_ENV !== 'production') {
  insertSampleData()
}