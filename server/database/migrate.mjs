// データベースマイグレーション実行スクリプト
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベース接続
const db = new Database(path.join(__dirname, '../../data/appointy.db'));

// マイグレーション実行
function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`マイグレーションファイルが見つかりません: ${migrationFile}`);
    return;
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const statements = sql.split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  try {
    db.exec('BEGIN TRANSACTION');
    
    statements.forEach(statement => {
      console.log(`実行中: ${statement.substring(0, 50)}...`);
      db.exec(statement);
    });
    
    db.exec('COMMIT');
    console.log(`マイグレーション完了: ${migrationFile}`);
  } catch (error) {
    db.exec('ROLLBACK');
    console.error(`マイグレーションエラー: ${error.message}`);
  }
}

// マイグレーションを順次実行
runMigration('002_add_reservation_columns.sql');
runMigration('003_create_reservation_messages.sql');
runMigration('004_create_indexes.sql');

// データベース接続を閉じる
db.close();