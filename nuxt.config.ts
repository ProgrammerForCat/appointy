// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // モジュール設定
  modules: ['@nuxtjs/tailwindcss'],
  
  // TypeScript設定
  typescript: {
    strict: true
  },

  // 環境変数の設定
  runtimeConfig: {
    // サーバーサイドのみで利用可能
    s3Endpoint: process.env.S3_ENDPOINT || '',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',
    s3Bucket: process.env.S3_BUCKET || '',
    
    // クライアントサイドでも利用可能
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // サーバー設定
  nitro: {
    preset: 'node-server'
  }
})
