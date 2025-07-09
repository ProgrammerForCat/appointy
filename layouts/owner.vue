<template>
  <div class="min-h-screen bg-gray-50">
    <!-- オーナー用ヘッダー -->
    <header class="bg-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/owner/dashboard" class="text-xl font-bold">
              Appointy オーナー
            </NuxtLink>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink to="/owner/dashboard" class="hover:text-blue-200">
              ダッシュボード
            </NuxtLink>
            <NuxtLink to="/owner/services" class="hover:text-blue-200">
              サービス管理
            </NuxtLink>
            <NuxtLink to="/owner/settings" class="hover:text-blue-200">
              設定
            </NuxtLink>
            <button @click="logout" class="hover:text-blue-200">
              ログアウト
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
// ログアウト処理
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/owner/login')
  } catch (error) {
    console.error('ログアウトエラー:', error)
  }
}
</script>