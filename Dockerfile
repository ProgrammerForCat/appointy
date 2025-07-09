# Node.js 20を使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# Gitをインストール
RUN apk add --no-cache git

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションファイルをコピー
COPY . .

# 必要なディレクトリを作成し、権限を設定
RUN mkdir -p data public/uploads .nuxt .output && \
    chmod -R 777 data public/uploads .nuxt .output

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]