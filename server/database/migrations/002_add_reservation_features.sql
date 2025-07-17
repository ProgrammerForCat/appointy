-- 予約機能拡張のマイグレーション
-- 実行日時: 2024-07-17

-- 1. reservationsテーブルにカラムを追加
ALTER TABLE reservations ADD COLUMN confirmed_at DATETIME;
ALTER TABLE reservations ADD COLUMN notes TEXT;

-- 2. 予約メッセージテーブルを作成
CREATE TABLE reservation_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'owner')),
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 3. インデックスを作成
CREATE INDEX idx_reservation_messages_reservation_id ON reservation_messages(reservation_id);
CREATE INDEX idx_reservation_messages_created_at ON reservation_messages(created_at);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_confirmed_at ON reservations(confirmed_at);