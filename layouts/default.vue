<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <AppHeader :user-type="'customer'" key="customer-header" />

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
// 共通ヘッダーを使用するため、認証関連のロジックはAppHeaderに移動
</script>