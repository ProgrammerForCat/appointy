<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- ページタイトル -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">ダッシュボード</h1>
    </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- 予約を作る -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">新規予約</h2>
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">サービスを選んで予約を作成します</p>
          <NuxtLink
            to="/booking"
            class="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            予約する
          </NuxtLink>
        </div>

        <!-- 予約履歴 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">予約履歴</h2>
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">過去の予約を確認できます</p>
          <NuxtLink
            to="/reservations"
            class="block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            予約履歴を見る
          </NuxtLink>
        </div>

        <!-- 店舗を開設する -->
        <div v-if="!hasStore" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">店舗開設</h2>
            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">あなたの店舗を開設して予約を受け付けましょう</p>
          <NuxtLink
            to="/store/register"
            class="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            店舗を開設する
          </NuxtLink>
        </div>

        <!-- 店舗管理（店舗がある場合） -->
        <div v-else class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">店舗管理</h2>
            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">店舗の管理画面へアクセス</p>
          <NuxtLink
            to="/owner/dashboard"
            class="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            店舗管理画面へ
          </NuxtLink>
        </div>

      </div>

      <!-- 最近の予約 -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">最近の予約</h2>
        <div v-if="recentReservations.length === 0" class="text-gray-500 text-center py-8">
          まだ予約がありません
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="reservation in recentReservations"
            :key="reservation.id"
            class="border-b pb-4 last:border-b-0"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ reservation.service_name }}</p>
                <p class="text-sm text-gray-600">{{ reservation.store_name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(reservation.start_time) }}</p>
              </div>
              <span
                :class="{
                  'bg-green-100 text-green-800': reservation.status === 'confirmed',
                  'bg-red-100 text-red-800': reservation.status === 'cancelled'
                }"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ reservation.status === 'confirmed' ? '確定' : 'キャンセル済み' }}
              </span>
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