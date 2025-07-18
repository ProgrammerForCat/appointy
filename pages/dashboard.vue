<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- ページタイトル -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ダッシュボード</h1>
        <p class="text-gray-600 mt-2">おかえりなさい、{{ userName || 'ユーザー' }}さん</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- 予約を作る -->
        <div class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">新規予約</h2>
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">サービスを選んで予約を作成します</p>
            <NuxtLink
              to="/booking"
              class="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              予約する
            </NuxtLink>
          </div>
        </div>

        <!-- 予約履歴 -->
        <div class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">予約履歴</h2>
              <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">過去の予約を確認できます</p>
            <NuxtLink
              to="/reservations"
              class="flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              予約履歴を見る
            </NuxtLink>
          </div>
        </div>

        <!-- 店舗を開設する -->
        <div v-if="!hasStore" class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">店舗開設</h2>
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">あなたの店舗を開設して予約を受け付けましょう</p>
            <NuxtLink
              to="/store/register"
              class="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              店舗を開設する
            </NuxtLink>
          </div>
        </div>

        <!-- 店舗管理（店舗がある場合） -->
        <div v-else class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">店舗管理</h2>
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">店舗の管理画面へアクセス</p>
            <NuxtLink
              to="/owner/dashboard"
              class="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              店舗管理画面へ
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- 最近の予約 -->
      <div class="mt-8 bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">最近の予約</h2>
        <div v-if="recentReservations.length === 0" class="text-center py-16">
          <div class="text-gray-400 text-6xl mb-4">📅</div>
          <p class="text-gray-500 text-lg">まだ予約がありません</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="reservation in recentReservations"
            :key="reservation.id"
            class="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-900">{{ reservation.service_name }}</p>
                <p class="text-sm text-blue-600 mt-1">{{ reservation.store_name }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(reservation.start_time) }}</p>
              </div>
              <span
                :class="{
                  'bg-gradient-to-r from-green-400 to-green-500 text-white': reservation.status === 'confirmed',
                  'bg-gradient-to-r from-red-400 to-red-500 text-white': reservation.status === 'cancelled'
                }"
                class="px-3 py-1 text-xs rounded-full font-medium shadow-sm"
              >
                {{ reservation.status === 'confirmed' ? '確定' : 'キャンセル済み' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// データ
const userName = ref('')
const hasStore = ref(false)
const recentReservations = ref([])

// ユーザー情報を取得
const fetchUserInfo = async () => {
  try {
    const user = await $fetch('/api/auth/me')
    userName.value = user.name
    hasStore.value = user.hasStore
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error)
  }
}

// 最近の予約を取得
const fetchRecentReservations = async () => {
  try {
    // TODO: APIが実装されたら有効化
    // const reservations = await $fetch('/api/my/reservations?limit=5')
    // recentReservations.value = reservations
  } catch (error) {
    console.error('予約の取得に失敗しました:', error)
  }
}

// 日付フォーマット
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ログアウト処理はAppHeaderに移動

// 初期化
onMounted(() => {
  fetchUserInfo()
  fetchRecentReservations()
})
</script>