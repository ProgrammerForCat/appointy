<template>
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div class="max-w-md w-full space-y-8">
        <div class="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl"></div>
          <div class="relative">
            <div class="text-center mb-8">
              <div class="flex items-center justify-center mb-4">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
              </div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ログイン
              </h2>
              <p class="mt-3 text-gray-600">
                アカウントをお持ちでない方は
                <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  新規登録
                </NuxtLink>
              </p>
            </div>
            
            <form class="space-y-6" @submit.prevent="login">
              <div class="space-y-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      v-model="email"
                      id="email"
                      name="email"
                      type="email"
                      autocomplete="email"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="メールアドレスを入力"
                    />
                  </div>
                </div>
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    パスワード
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      v-model="password"
                      id="password"
                      name="password"
                      type="password"
                      autocomplete="current-password"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="パスワードを入力"
                    />
                  </div>
                </div>
              </div>

              <div v-if="error" class="bg-red-50/80 border border-red-200 rounded-xl p-4 backdrop-blur-sm">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-red-800 text-sm">{{ error }}</span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'ログイン中...' : 'ログイン' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// definePageMetaを削除（blankレイアウトを使用）

// ルートパラメータ
const route = useRoute()

// データの定義
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// ログイン処理
const login = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    // リダイレクト先を判定（店舗がある場合は店舗ダッシュボード、ない場合はユーザーダッシュボード）
    const redirect = route.query.redirect || (response.user.hasStore ? '/owner/dashboard' : '/dashboard')
    await navigateTo(redirect)
  } catch (err) {
    error.value = err.data?.message || 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}
</script>