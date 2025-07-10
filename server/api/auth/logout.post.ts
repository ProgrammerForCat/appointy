export default defineEventHandler(async (event) => {
  // Cookieからトークンを削除
  setCookie(event, 'auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0 // 即座に削除
  })
  
  return {
    success: true,
    message: 'ログアウトしました'
  }
})