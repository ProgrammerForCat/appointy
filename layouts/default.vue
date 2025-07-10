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
            <NuxtLink to="/owner/login" class="text-gray-600 hover:text-gray-900">
              オーナーログイン
            </NuxtLink>
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