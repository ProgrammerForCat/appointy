<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50">
      <!-- ヒーローセクション -->
      <div class="bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Appointy
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              シンプルで使いやすい予約管理システム
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/booking" 
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                予約する
              </NuxtLink>
              <NuxtLink 
                to="/login" 
                class="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                ログイン / 新規登録
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 特徴セクション -->
      <div class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900">主な機能</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">簡単予約</h3>
              <p class="text-gray-600">
                お客様は24時間いつでも簡単に予約が可能
              </p>
            </div>
            <div class="text-center">
              <div class="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">予約管理</h3>
              <p class="text-gray-600">
                予約状況を一目で確認、効率的な管理が可能
              </p>
            </div>
            <div class="text-center">
              <div class="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">時間管理</h3>
              <p class="text-gray-600">
                営業時間とサービス時間を柔軟に設定
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA セクション -->
      <div class="bg-blue-600 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            今すぐ予約を始めましょう
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            簡単な操作で、すぐに予約が可能です
          </p>
          <NuxtLink 
            to="/booking" 
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
          >
            予約画面へ
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// ランディングページ用のメタデータ
useHead({
  title: 'Appointy - シンプルな予約管理システム',
  meta: [
    { name: 'description', content: '小規模な店舗や個人事業主向けの予約管理システム' }
  ]
})
</script>