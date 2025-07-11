# 重要事項
- やり取りは日本語でおこなう
- API仕様書は必ずAPIのフォルダ単位で1つのファイルとして、Swagger UI形式でdocフォルダに置く
- APIに変更がある場合、上記仕様書を必ず修正する
- ER図もdoc/ER図.mdにMermaid記法で作成して置き、DBに変更がある場合は更新する
- 画面遷移図、実装状況も必ずdocフォルダで管理し、機能追加・変更時には必ず更新する
- 大きなシステム変更の際は、設計書・画面遷移図・API仕様書・ER図・実装状況をすべて同期して更新する

# 規約・構成

# プロジェクトの基本設定
- BE/FEともにNuxt3を使う
- Claude Flareにデプロイする(FE/BE/DB/R2)
- 開発にはdevdockerを使う
- 開発時のR2の代わりはDockerのminioを使う

# アーキテクチャ原則
- 統一ユーザーシステムを採用（ユーザー → 任意で店舗運営者に昇格）
- 1ユーザー1店舗まで（店舗テーブルのuser_idはUNIQUE制約）
- マルチテナント対応：すべてのビジネスデータはstore_idで分離
- 認証必須の予約システム（customer_idでユーザーと紐付け）

# データベース設計原則
- users: 認証情報のみ（店舗固有情報は含まない）
- stores: 店舗情報（usersと1:0..1の関係）
- services: store_id基準でテナント分離
- reservations: customer_id（user_id）で予約者を特定

# API設計原則
- 統一認証：/api/auth/* - 全ユーザー共通
- 顧客API：/api/customer/* - 認証必須
- 店舗API：/api/owner/* - 店舗所有必須  
- 公開API：/api/public/* - 一部認証必須
- 店舗登録：/api/store/* - 認証必須

# 認証・認可原則
- JWTトークン + httpOnlyクッキー
- middleware/auth.js: 基本認証チェック
- middleware/auth-owner.js: 店舗所有者チェック（店舗なしは店舗登録へリダイレクト）
- middleware/has-store.js: 店舗存在チェック

# コーディング規約
- TypeScriptを使用する。
- 変数名はcamelCaseで記述する
- コメントは日本語で記述する
- 複雑なところや、説明が必要なところには必ずコメントを入れる
