// カテゴリカラムのマイグレーション
import { execute, query } from '../database'

export async function migrateCategoryColumn() {
  try {
    console.log('カテゴリカラムのマイグレーションを開始します...')
    
    // カラムが既に存在するかチェック
    try {
      const result = query('SELECT category FROM services LIMIT 1', [])
      console.log('カテゴリカラムは既に存在します')
      return
    } catch (error) {
      // カラムが存在しない場合、エラーが発生するので追加する
      console.log('カテゴリカラムを追加します...')
    }
    
    // カテゴリカラムを追加
    execute("ALTER TABLE services ADD COLUMN category TEXT DEFAULT 'その他'", [])
    
    // 既存のサービスにカテゴリを設定（サービス名から推測）
    const services = query('SELECT id, name FROM services', [])
    
    for (const service of services) {
      let category = 'その他'
      const name = service.name.toLowerCase()
      
      // サービス名からカテゴリを推測
      if (name.includes('カット') || name.includes('ヘア') || name.includes('美容')) {
        category = '美容・ヘアケア'
      } else if (name.includes('マッサージ') || name.includes('整体') || name.includes('リラク')) {
        category = 'リラクゼーション'
      } else if (name.includes('ネイル')) {
        category = 'ネイル'
      } else if (name.includes('相談') || name.includes('コンサル')) {
        category = 'コンサルティング'
      } else if (name.includes('レッスン') || name.includes('教室')) {
        category = 'レッスン・教室'
      } else if (name.includes('健康') || name.includes('フィットネス')) {
        category = 'ヘルス・フィットネス'
      }
      
      execute('UPDATE services SET category = ? WHERE id = ?', [category, service.id])
    }
    
    // インデックスを追加
    execute('CREATE INDEX IF NOT EXISTS idx_services_category ON services(category)', [])
    
    console.log('カテゴリカラムのマイグレーションが完了しました')
    console.log(`${services.length}件のサービスにカテゴリを設定しました`)
    
  } catch (error) {
    console.error('マイグレーションエラー:', error)
    throw error
  }
}

// サポートされているカテゴリ一覧
export const SUPPORTED_CATEGORIES = [
  '美容・ヘアケア',
  'ネイル', 
  'リラクゼーション',
  'ヘルス・フィットネス',
  'レッスン・教室',
  'コンサルティング',
  'その他'
] as const

export type ServiceCategory = typeof SUPPORTED_CATEGORIES[number]