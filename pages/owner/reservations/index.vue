<template>
  <NuxtLayout name="owner">
    <div class="space-y-6">
      <!-- ヘッダー -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">予約管理</h1>
          <div class="flex space-x-4">
            <!-- フィルター -->
            <select
              v-model="statusFilter"
              @change="loadReservations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのステータス</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>
            
            <!-- 日付フィルター -->
            <input
              v-model="dateFilter"
              @change="loadReservations"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
        
        <!-- 統計情報 -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-blue-600 text-sm font-medium">今日の予約</div>
            <div class="text-2xl font-bold text-blue-900">{{ todayCount }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-green-600 text-sm font-medium">確定予約</div>
            <div class="text-2xl font-bold text-green-900">{{ confirmedCount }}</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-red-600 text-sm font-medium">キャンセル</div>
            <div class="text-2xl font-bold text-red-900">{{ cancelledCount }}</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-purple-600 text-sm font-medium">総予約数</div>
            <div class="text-2xl font-bold text-purple-900">{{ totalCount }}</div>
          </div>
        </div>
      </div>

      <!-- 予約一覧 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">予約一覧</h2>
        </div>
        
        <div v-if="reservations.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="reservation in reservations"
            :key="reservation.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ reservation.customerName }}</h3>
                  <span
                    :class="getStatusClass(reservation.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
                <div class="mt-2 space-y-1">
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📧 {{ reservation.customerEmail }}</span>
                    <span>📅 {{ formatDate(reservation.startTime) }}</span>
                    <span>🕐 {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <span>🔧 {{ reservation.serviceName }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewReservation(reservation)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  詳細
                </button>
                <button
                  v-if="reservation.status === 'confirmed'"
                  @click="cancelReservation(reservation)"
                  class="text-red-600 hover:text-red-900"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="p-6 text-center text-gray-500">
          予約がありません。
        </div>
      </div>
    </div>

    <!-- 詳細モーダル -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">予約詳細</h3>
          
          <div v-if="selectedReservation" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">顧客名</label>
              <p class="text-gray-900">{{ selectedReservation.customerName }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">メールアドレス</label>
              <p class="text-gray-900">{{ selectedReservation.customerEmail }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">サービス</label>
              <p class="text-gray-900">{{ selectedReservation.serviceName }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">日時</label>
              <p class="text-gray-900">
                {{ formatDate(selectedReservation.startTime) }} 
                {{ formatTime(selectedReservation.startTime) }} - {{ formatTime(selectedReservation.endTime) }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">ステータス</label>
              <span :class="getStatusClass(selectedReservation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusText(selectedReservation.status) }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">作成日時</label>
              <p class="text-gray-900">{{ formatDateTime(selectedReservation.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex space-x-3 pt-6">
            <button
              v-if="selectedReservation?.status === 'confirmed'"
              @click="cancelReservation(selectedReservation)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              キャンセル
            </button>
            <button
              @click="closeDetailModal"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              閉じる
            </button>
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
const showDetailModal = ref(false)
const selectedReservation = ref(null)
const statusFilter = ref('')
const dateFilter = ref('')

// 統計情報の計算
const todayCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservations.value.filter(r => r.startTime.startsWith(today) && r.status === 'confirmed').length
})

const confirmedCount = computed(() => {
  return reservations.value.filter(r => r.status === 'confirmed').length
})

const cancelledCount = computed(() => {
  return reservations.value.filter(r => r.status === 'cancelled').length
})

const totalCount = computed(() => {
  return reservations.value.length
})

// ステータスのスタイル
const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'confirmed': return '確定'
    case 'cancelled': return 'キャンセル'
    default: return '不明'
  }
}

// 日時フォーマット
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  })
}

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString('ja-JP')
}

// 予約詳細表示
const viewReservation = (reservation) => {
  selectedReservation.value = reservation
  showDetailModal.value = true
}

// 詳細モーダル閉じる
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedReservation.value = null
}

// 予約キャンセル
const cancelReservation = async (reservation) => {
  if (!confirm(`${reservation.customerName}様の予約をキャンセルしますか？`)) return
  
  try {
    await $fetch(`/api/owner/reservations/${reservation.id}`, {
      method: 'DELETE'
    })
    closeDetailModal()
    await loadReservations()
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// フィルタークリア
const clearFilters = () => {
  statusFilter.value = ''
  dateFilter.value = ''
  loadReservations()
}

// 予約一覧取得
const loadReservations = async () => {
  try {
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await $fetch(`/api/owner/reservations${query}`)
    reservations.value = response.reservations
  } catch (err) {
    console.error('予約取得エラー:', err)
  }
}

// 初期データの取得
onMounted(() => {
  loadReservations()
})
</script>