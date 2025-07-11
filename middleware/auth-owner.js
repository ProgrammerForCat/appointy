export default defineNuxtRouteMiddleware(async (to, from) => {
  // クライアントサイドでのみ認証チェック
  if (process.client) {
    try {
      await $fetch('/api/auth/me', {
        credentials: 'include'
      })
    } catch (error) {
      const redirectPath = to.fullPath
      return navigateTo(`/owner/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }
})