# 重要事項
- やり取りは日本語でおこなう
- API仕様書は必ずAPIのフォルダ単位で1つのファイルとして、Swagger UI形式でdocフォルダに置く
- APIに変更がある場合、上記仕様書を必ず修正する
- ER図もdoc/ER図.mdにMermaid記法で作成して置き、DBに変更がある場合は更新する

# 規約・構成

# プロジェクトの基本設定
- BE/FEともにNuxt3を使う
- Claude Flareにデプロイする(FE/BE/DB/R2)
- 開発にはdevdockerを使う
- 開発時のR2の代わりはDockerのminioを使う

# コーディング規約
- TypeScriptを使用する。
- 変数名はcamelCaseで記述する
- コメントは日本語で記述する
- 複雑なところや、説明が必要なところには必ずコメントを入れる
