# Appointy - 予約管理システム

小規模な店舗や個人事業主向けの予約管理システムです。顧客がオンラインで簡単に予約でき、オーナーが効率的に予約を管理できます。

## 技術スタック

- **フレームワーク**: Nuxt 3
- **データベース**: SQLite (開発環境) / Cloudflare D1 (本番環境)
- **ストレージ**: MinIO (開発環境) / Cloudflare R2 (本番環境)
- **認証**: JWT + bcryptjs
- **スタイリング**: Tailwind CSS
- **開発環境**: Docker + DevContainer

## 開発環境のセットアップ

### 1. DevContainer を使用する場合（推奨）

1. VS Code で DevContainer 拡張機能をインストール
2. プロジェクトフォルダを開く
3. コマンドパレットで「Dev Containers: Reopen in Container」を実行

### 2. Docker Compose を使用する場合

```bash
# プロジェクトクローン
git clone <repository-url>
cd appointy

# Docker Compose で起動
docker-compose up -d

# ログを確認
docker-compose logs -f app
```

### 3. ローカル開発する場合

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## アクセス先

- **アプリケーション**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **MinIO API**: http://localhost:9000

## サンプルデータ

初回起動時に以下のサンプルデータが自動で作成されます：

### オーナーアカウント
- **メール**: owner@example.com
- **パスワード**: password123

### サンプルサービス
- 60分カウンセリング (¥5,000)
- 90分カウンセリング (¥7,500)
- 初回相談30分 (¥3,000)

## 開発コマンド

### Docker環境の操作
```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログを確認
docker compose logs -f app
```

### アプリケーション内での開発
コンテナ内で自動的に以下が実行されます：
- `npm install` - 依存関係のインストール
- `npm run dev` - 開発サーバーの起動

## プロジェクト構成

```
appointy/
├── server/          # Cloudflare Workers API
├── pages/           # Nuxtページコンポーネント
├── components/      # 再利用可能なVueコンポーネント
├── composables/     # Composition API ユーティリティ
├── public/          # 静的ファイル
├── Dockerfile       # Docker設定
├── docker-compose.yml # Docker Compose設定
└── nuxt.config.ts   # Nuxt設定
```