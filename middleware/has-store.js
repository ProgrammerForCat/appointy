export default defineNuxtRouteMiddleware(async (to, from) => {
  // クライアントサイドでのみチェック
  if (process.client) {
    try {
      const user = await $fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      // 店舗を持っていない場合は店舗登録画面へリダイレクト
      if (!user.hasStore) {
        return navigateTo('/store/register')
      }
    } catch (error) {
      // 認証エラーの場合はログイン画面へ
      return navigateTo('/login')
    }
  }
})