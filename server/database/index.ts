import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

// データベース接続の初期化
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/appointy.db' 
  : join(process.cwd(), 'data/appointy.db')

export const db = new Database(dbPath)

// WALモードを有効にして同時実行性を向上
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

// スキーマの初期化
export function initializeDatabase() {
  try {
    const schemaSQL = readFileSync(join(process.cwd(), 'server/database/schema.sql'), 'utf8')
    db.exec(schemaSQL)
    console.log('データベースが正常に初期化されました')
  } catch (error) {
    console.error('データベースの初期化エラー:', error)
    throw error
  }
}

// データベースクエリのヘルパー関数
export function query(sql: string, params: any[] = []) {
  try {
    return db.prepare(sql).all(params)
  } catch (error) {
    console.error('クエリエラー:', error)
    throw error
  }
}

// queryAllはqueryのエイリアス
export const queryAll = query

export function queryOne(sql: string, params: any[] = []) {
  try {
    return db.prepare(sql).get(params)
  } catch (error) {
    console.error('クエリエラー:', error)
    throw error
  }
}

export function execute(sql: string, params: any[] = []) {
  try {
    return db.prepare(sql).run(params)
  } catch (error) {
    console.error('実行エラー:', error)
    throw error
  }
}

// アプリケーション起動時にデータベースを初期化
initializeDatabase()

// マイグレーション実行（開発環境のみ）
if (process.env.NODE_ENV !== 'production') {
  import('./../../server/utils/migrate-categories').then(module => {
    module.migrateCategoryColumn().catch(error => {
      console.warn('マイグレーション警告:', error.message)
    })
  })
}

// サンプルデータを挿入（開発環境のみ）
if (process.env.NODE_ENV !== 'production') {
  import('./../../server/utils/sample-data').then(module => {
    // サンプルデータ挿入は別途実行される
  })
}