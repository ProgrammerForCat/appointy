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
      const redirectPath = to.fullPath
      return navigateTo(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }
})