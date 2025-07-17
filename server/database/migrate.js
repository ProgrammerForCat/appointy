// データベースマイグレーション実行スクリプト
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// データベース接続
const db = new Database(path.join(__dirname, '../data/database.db'));

// マイグレーション実行
function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`マイグレーションファイルが見つかりません: ${migrationFile}`);
    return;
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
  
  try {
    db.exec('BEGIN TRANSACTION');
    
    statements.forEach(statement => {
      const cleanStatement = statement.trim();
      if (cleanStatement && !cleanStatement.startsWith('--')) {
        console.log(`実行中: ${cleanStatement.substring(0, 50)}...`);
        db.exec(cleanStatement);
      }
    });
    
    db.exec('COMMIT');
    console.log(`マイグレーション完了: ${migrationFile}`);
  } catch (error) {
    db.exec('ROLLBACK');
    console.error(`マイグレーションエラー: ${error.message}`);
  }
}

// 002_add_reservation_features.sqlを実行
runMigration('002_add_reservation_features.sql');

// データベース接続を閉じる
db.close();