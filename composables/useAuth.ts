export const useAuth = () => {
  const checkAuth = async () => {
    try {
      await $fetch('/api/auth/me')
      return true
    } catch {
      return false
    }
  }

  const getUser = async () => {
    try {
      const user = await $fetch('/api/auth/me')
      return user
    } catch {
      return null
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // エラーを無視
    }
    await navigateTo('/')
  }

  return {
    checkAuth,
    getUser,
    logout
  }
}