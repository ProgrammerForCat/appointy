// サンプルデータ挿入用のユーティリティ
import { execute, queryOne } from '../database'
import { hashPassword } from './auth'

export async function insertSampleData() {
  try {
    // 既存のユーザーがいるかチェック
    const existingUser = queryOne('SELECT * FROM users LIMIT 1', [])
    if (existingUser) {
      console.log('既存のユーザーが存在するため、サンプルデータの挿入をスキップします')
      return
    }
    
    // サンプルユーザーを作成（店舗オーナー）
    const hashedPassword = await hashPassword('password123')
    
    // ユーザー登録
    const userResult = execute(
      'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)',
      ['田中太郎', 'owner@example.com', hashedPassword]
    )
    
    const userId = userResult.lastInsertRowid as number
    
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
    
    const storeResult = execute(
      'INSERT INTO stores (user_id, store_name, description, business_hours) VALUES (?, ?, ?, ?)',
      [userId, '田中太郎カウンセリングルーム', '10年以上の経験を持つカウンセラーです。心の悩みから人生相談まで幅広く対応いたします。', businessHours]
    )
    
    const storeId = storeResult.lastInsertRowid as number
    
    // サンプルサービスを作成
    const services = [
      { name: '60分カウンセリング', duration: 60, price: 5000, category: 'コンサルティング' },
      { name: '90分カウンセリング', duration: 90, price: 7500, category: 'コンサルティング' },
      { name: '初回相談（30分）', duration: 30, price: 3000, category: 'コンサルティング' }
    ]
    
    for (const service of services) {
      execute(
        'INSERT INTO services (store_id, name, duration_minutes, price, category) VALUES (?, ?, ?, ?, ?)',
        [storeId, service.name, service.duration, service.price, service.category]
      )
    }
    
    // サンプル顧客ユーザーを作成
    const customerPassword = await hashPassword('password123')
    
    const customerResult = execute(
      'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)',
      ['山田花子', 'customer@example.com', customerPassword]
    )
    
    const customerId = customerResult.lastInsertRowid as number
    
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