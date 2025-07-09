FROM node:20-bullseye

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    openssh-client \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# pnpmをグローバルにインストール
RUN npm install -g pnpm

# 作業ディレクトリを設定
WORKDIR /workspace

# gitの設定（安全なディレクトリとして設定）
RUN git config --global --add safe.directory /workspace