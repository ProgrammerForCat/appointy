<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100">
    <div class="space-y-6">
      <div class="bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ダッシュボード</h1>
          <div class="flex items-center space-x-4">
            <span v-if="user" class="text-sm text-gray-600">
              <span class="font-medium">{{ user.name }}</span> さん
            </span>
          </div>
        </div>
        
        <!-- 統計情報 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            @click="navigateToReservations('today')"
            class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
            <div class="relative flex justify-between items-start">
              <div>
                <div class="text-blue-600 text-sm font-medium mb-2">今日の予約</div>
                <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ todayReservations.length }}</div>
              </div>
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          <div 
            @click="navigateToReservations('monthly')"
            class="group relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl"></div>
            <div class="relative flex justify-between items-start">
              <div>
                <div class="text-green-600 text-sm font-medium mb-2">今月の予約</div>
                <div class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{{ monthlyReservations.length }}</div>
              </div>
              <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          <div 
            @click="navigateToServices"
            class="relative bg-white backdrop-blur-sm border border-gray-300 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
            <div class="relative flex justify-between items-start">
              <div>
                <div class="text-purple-600 text-sm font-medium mb-2">アクティブサービス</div>
                <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ activeServices.length }}</div>
              </div>
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 今日の予約 -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">今日の予約</h2>
          <div v-if="todayReservations.length > 0" class="space-y-3">
            <div 
              v-for="reservation in todayReservations" 
              :key="reservation.id"
              class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:bg-gray-100 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-gray-900">{{ reservation.customerName }}</div>
                  <div class="text-sm text-blue-600 mt-1">{{ reservation.serviceName }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ reservation.status }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-gray-400 text-5xl mb-3">📅</div>
            <p class="text-gray-500">今日の予約はありません</p>
          </div>
        </div>

        <!-- 最近の予約 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">最近の予約</h2>
          <div v-if="recentReservations.length > 0" class="space-y-3">
            <div 
              v-for="reservation in recentReservations" 
              :key="reservation.id"
              class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:bg-gray-100 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-gray-900">{{ reservation.customerName }}</div>
                  <div class="text-sm text-blue-600 mt-1">{{ reservation.serviceName }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatDate(reservation.startTime) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ reservation.status }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-gray-400 text-5xl mb-3">📄</div>
            <p class="text-gray-500">最近の予約はありません</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth-owner',
  layout: 'owner'
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

// 予約管理ページへのナビゲーション
const navigateToReservations = (filterType) => {
  let queryParams = ''
  
  switch (filterType) {
    case 'today':
      queryParams = '?filter=today'
      break
    case 'monthly':
      const thisMonth = new Date().toISOString().substr(0, 7)
      queryParams = `?filter=monthly&month=${thisMonth}`
      break
  }
  
  navigateTo(`/owner/reservations${queryParams}`)
}

// サービス管理ページへのナビゲーション
const navigateToServices = () => {
  navigateTo('/owner/services')
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