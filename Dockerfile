# Node.js 20を使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# Git及びbetter-sqlite3のビルドに必要な依存関係をインストール
RUN apk add --no-cache git python3 make g++ gcc libc-dev

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール（better-sqlite3のビルドを含む）
RUN npm ci --build-from-source

# アプリケーションファイルをコピー
COPY . .

# 必要なディレクトリを作成し、権限を設定
RUN mkdir -p data public/uploads .nuxt .output && \
    chmod -R 777 data public/uploads .nuxt .output

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]