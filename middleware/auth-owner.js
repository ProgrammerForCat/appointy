export default defineNuxtRouteMiddleware(async (to, from) => {
  // サーバーサイドでのみ実行
  if (process.server) {
    try {
      // 認証状態をチェック
      await $fetch('/api/auth/me')
    } catch (error) {
      // 認証に失敗した場合、ログインページにリダイレクト
      return navigateTo('/owner/login')
    }
  }
})