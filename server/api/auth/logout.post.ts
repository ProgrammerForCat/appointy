export default defineEventHandler(async (event) => {
  try {
    // Cookieからトークンを削除
    deleteCookie(event, 'auth-token')
    
    return {
      message: 'ログアウトしました'
    }
  } catch (error) {
    console.error('ログアウトエラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラーが発生しました'
    })
  }
})