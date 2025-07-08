# appointy
小規模な店舗や個人事業主（例：サロン、コンサルタント、個人レッスン講師）が、自身のサービスと予約可能時間を設定し、顧客がオンラインで簡単に予約できるシステム

## 技術スタック

- **フレームワーク**: Nuxt 3
- **実行環境**: 
  - フロントエンド: Cloudflare Pages
  - バックエンドAPI: Cloudflare Workers
- **データベース**: Cloudflare D1
- **ファイルストレージ**: Cloudflare R2
- **スタイリング**: TailwindCSS

## 開発環境のセットアップ

### 前提条件
- Docker と Docker Compose がインストールされていること

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/ProgrammerForCat/appointy.git
cd appointy
```

2. Docker環境を起動
```bash
docker compose up -d
```

3. アプリケーションにアクセス
- Nuxt3アプリ: http://localhost:3000
- MinIO管理画面: http://localhost:9001
  - ユーザー名: minioadmin
  - パスワード: minioadmin

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