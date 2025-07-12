<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              Appointy
            </NuxtLink>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink to="/booking" class="text-gray-600 hover:text-gray-900">
              予約する
            </NuxtLink>
            <template v-if="isAuthenticated">
              <NuxtLink to="/reservations" class="text-gray-600 hover:text-gray-900">
                予約履歴
              </NuxtLink>
              <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
                ダッシュボード
              </NuxtLink>
              <button 
                @click="logout"
                class="text-gray-600 hover:text-gray-900"
              >
                ログアウト
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900">
                ログイン
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main>
      <slot />
    </main>

    <!-- フッター -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8 text-center text-gray-600">
          <p>&copy; 2024 Appointy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 認証状態管理
const { checkAuth, logout: authLogout } = useAuth()
const isAuthenticated = ref(false)

// ログアウト処理
const logout = async () => {
  await authLogout()
  isAuthenticated.value = false
  await navigateTo('/')
}

// 認証状態を確認
onMounted(async () => {
  isAuthenticated.value = await checkAuth()
})

// ページ変更時に認証状態を再確認
watch(() => useRoute().path, async () => {
  isAuthenticated.value = await checkAuth()
})
</script>