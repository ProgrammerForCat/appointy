<template>
  <div class="min-h-screen bg-gray-50">
    <!-- オーナー用ヘッダー -->
    <AppHeader :user-type="'owner'" key="owner-header" />

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
// 共通ヘッダーを使用するため、ログアウト処理はAppHeaderに移動
</script>