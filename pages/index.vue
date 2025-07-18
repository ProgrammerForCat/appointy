<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- ヒーローセクション -->
      <div class="relative bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Appointy
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              シンプルで使いやすい、モダンな予約管理システム
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/booking" 
                class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 md:text-lg md:px-10"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                予約する
              </NuxtLink>
              <NuxtLink 
                v-if="!isAuthenticated"
                to="/login" 
                class="inline-flex items-center justify-center px-8 py-4 bg-white/70 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200 backdrop-blur-sm md:text-lg md:px-10"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                ログイン / 新規登録
              </NuxtLink>
              <NuxtLink 
                v-else
                to="/dashboard" 
                class="inline-flex items-center justify-center px-8 py-4 bg-white/70 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200 backdrop-blur-sm md:text-lg md:px-10"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                ダッシュボード
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 特徴セクション -->
      <div class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">主な機能</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">モダンで直感的な機能で、予約管理を効率化</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative text-center">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-900">簡単予約</h3>
                <p class="text-gray-600 leading-relaxed">
                  お客様は24時間いつでも簡単に予約が可能。直感的なUIで迷わず予約完了
                </p>
              </div>
            </div>
            <div class="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative text-center">
                <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-900">予約管理</h3>
                <p class="text-gray-600 leading-relaxed">
                  予約状況を一目で確認、効率的な管理が可能。承認フローとチャット機能も完備
                </p>
              </div>
            </div>
            <div class="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative text-center">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-900">時間管理</h3>
                <p class="text-gray-600 leading-relaxed">
                  営業時間とサービス時間を柔軟に設定。自動時間枠計算で重複予約を防止
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA セクション -->
      <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl font-bold text-white mb-4">
            今すぐ予約を始めましょう
          </h2>
          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            簡単な操作で、すぐに予約が可能です。モダンなUIで迷わず予約完了
          </p>
          <NuxtLink 
            to="/booking" 
            class="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-200 md:text-lg md:px-10"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            予約画面へ
          </NuxtLink>
        </div>
      </div>
    </div>
</template>

<script setup>
// レイアウト指定
definePageMeta({
  layout: 'default'
})
// 認証状態管理
const { checkAuth } = useAuth()
const isAuthenticated = ref(false)

// 認証状態を確認
onMounted(async () => {
  isAuthenticated.value = await checkAuth()
})

// ランディングページ用のメタデータ
useHead({
  title: 'Appointy - モダンな予約管理システム',
  meta: [
    { name: 'description', content: '小規模な店舗や個人事業主向けの、モダンで使いやすい予約管理システム' }
  ]
})
</script>