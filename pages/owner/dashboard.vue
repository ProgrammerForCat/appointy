<template>
  <NuxtLayout name="owner">
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/booking"
              class="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center space-x-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>予約画面を確認</span>
            </NuxtLink>
            <div v-if="user" class="text-sm text-gray-600">
              <span class="font-medium">{{ user.name }}</span> さん
            </div>
          </div>
        </div>
        
        <!-- 統計情報 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-blue-600 text-sm font-medium">今日の予約</div>
            <div class="text-2xl font-bold text-blue-900">{{ todayReservations.length }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-green-600 text-sm font-medium">今月の予約</div>
            <div class="text-2xl font-bold text-green-900">{{ monthlyReservations.length }}</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-purple-600 text-sm font-medium">アクティブサービス</div>
            <div class="text-2xl font-bold text-purple-900">{{ activeServices.length }}</div>
          </div>
        </div>

        <!-- 今日の予約 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">今日の予約</h2>
          <div v-if="todayReservations.length > 0" class="space-y-3">
            <div 
              v-for="reservation in todayReservations" 
              :key="reservation.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="font-medium text-gray-900">{{ reservation.customerName }}</div>
                <div class="text-sm text-gray-600">{{ reservation.serviceName }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}
                </div>
                <div class="text-xs text-gray-500">{{ reservation.status }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            今日の予約はありません
          </div>
        </div>

        <!-- 最近の予約 -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">最近の予約</h2>
          <div v-if="recentReservations.length > 0" class="space-y-3">
            <div 
              v-for="reservation in recentReservations" 
              :key="reservation.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="font-medium text-gray-900">{{ reservation.customerName }}</div>
                <div class="text-sm text-gray-600">{{ reservation.serviceName }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(reservation.startTime) }}
                </div>
                <div class="text-xs text-gray-500">{{ reservation.status }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            最近の予約はありません
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth-owner'
})

// データの定義
const reservations = ref([])
const services = ref([])
const user = ref(null)

// 計算プロパティ
const todayReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservations.value.filter(r => r.startTime.startsWith(today))
})

const monthlyReservations = computed(() => {
  const thisMonth = new Date().toISOString().substr(0, 7)
  return reservations.value.filter(r => r.startTime.startsWith(thisMonth))
})

const activeServices = computed(() => {
  return services.value.filter(s => s.isActive)
})

const recentReservations = computed(() => {
  return reservations.value.slice(0, 5)
})

// ユーティリティ関数
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('ja-JP')
}

// 初期データの取得
onMounted(async () => {
  try {
    // ユーザー情報を取得
    user.value = await $fetch('/api/auth/me')
    
    // 予約一覧を取得
    const reservationResponse = await $fetch('/api/owner/reservations')
    reservations.value = reservationResponse.reservations
    
    // サービス一覧を取得
    const serviceResponse = await $fetch('/api/owner/services')
    services.value = serviceResponse.services
  } catch (error) {
    // データ取得エラー時は何もしない
  }
})
</script>