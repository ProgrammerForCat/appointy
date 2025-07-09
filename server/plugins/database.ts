// データベースとディレクトリの初期化
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export default async () => {
  // 開発環境でのデータ保存ディレクトリを作成
  if (process.env.NODE_ENV !== 'production') {
    const dataDir = join(process.cwd(), 'data')
    const uploadsDir = join(process.cwd(), 'public/uploads')
    
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
    
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }
  }
  
  // データベース初期化は既にserver/database/index.tsで実行済み
  console.log('データベース初期化プラグインが実行されました')
}