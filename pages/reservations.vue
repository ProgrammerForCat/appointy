<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- ヘッダー -->
    <header class="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            予約履歴
          </h1>
          <NuxtLink 
            to="/dashboard" 
            class="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            ダッシュボードに戻る
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- フィルター -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-3">
              ステータス
            </label>
            <select
              v-model="selectedStatus"
              id="status"
              @change="loadReservations"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            >
              <option value="">すべて</option>
              <option value="pending">承認待ち</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="loadReservations"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              更新
            </button>
          </div>
        </div>
      </div>

      <!-- 予約一覧 -->
      <div class="space-y-6">
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900">
                    {{ reservation.serviceName }}
                  </h3>
                  <div class="flex items-center text-blue-600 mt-2">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1M9 16h1"></path>
                    </svg>
                    <span class="text-sm font-medium">{{ reservation.storeName }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <span
                    :class="{
                      'bg-gradient-to-r from-orange-400 to-orange-500 text-white': reservation.status === 'pending',
                      'bg-gradient-to-r from-green-400 to-green-500 text-white': reservation.status === 'confirmed',
                      'bg-gradient-to-r from-red-400 to-red-500 text-white': reservation.status === 'cancelled'
                    }"
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                  >
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white/50 rounded-xl p-4 border border-white/40">
                  <div class="flex items-center mb-2">
                    <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4H4a1 1 0 01-1-1V8a1 1 0 011-1h4z"></path>
                    </svg>
                    <span class="text-gray-600 text-sm font-medium">日時</span>
                  </div>
                  <p class="font-bold text-gray-900">{{ formatDateTime(reservation.startTime) }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-white/40">
                  <div class="flex items-center mb-2">
                    <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-gray-600 text-sm font-medium">所要時間</span>
                  </div>
                  <p class="font-bold text-gray-900">{{ reservation.durationMinutes }}分</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-white/40">
                  <div class="flex items-center mb-2">
                    <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="text-gray-600 text-sm font-medium">料金</span>
                  </div>
                  <p class="font-bold text-gray-900">¥{{ reservation.price.toLocaleString() }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-white/40">
                  <div class="flex items-center mb-2">
                    <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4H4a1 1 0 01-1-1V8a1 1 0 011-1h4z"></path>
                    </svg>
                    <span class="text-gray-600 text-sm font-medium">予約日</span>
                  </div>
                  <p class="font-bold text-gray-900">{{ formatDate(reservation.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- アクション -->
            <div class="mt-6 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row gap-3">
              <button
                @click="showDetails(reservation)"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                詳細・チャット
              </button>
              <NuxtLink
                :to="`/store/${reservation.storeId}/service/${reservation.serviceId}`"
                class="px-6 py-3 bg-white/70 text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-50 hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                再予約
              </NuxtLink>
              <button
                v-if="reservation.status === 'confirmed' && canCancel(reservation.startTime)"
                @click="cancelReservation(reservation.id)"
                class="px-6 py-3 bg-white/70 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-50 hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                キャンセル
              </button>
            </div>
          </div>
        </div>

        <!-- 空の状態 -->
        <div v-if="!loading && reservations.length === 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-16">
          <div class="text-center">
            <div class="text-gray-400 text-8xl mb-6">📅</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">予約履歴がありません</h3>
            <p class="text-gray-500 mb-8 text-lg">まだ予約を取られていません。</p>
            <NuxtLink
              to="/booking"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              予約する
            </NuxtLink>
          </div>
        </div>

        <!-- ローディング -->
        <div v-if="loading" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-16">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
              <svg class="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div class="text-gray-500 text-xl">読み込み中...</div>
          </div>
        </div>

        <!-- エラー -->
        <div v-if="error" class="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-red-800 font-medium">{{ error }}</div>
          </div>
          <button
            @click="loadReservations"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>

      <!-- もっと読み込み -->
      <div v-if="reservations.length > 0 && !loading" class="text-center mt-8">
        <button
          @click="loadMoreReservations"
          class="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 border border-white/40 rounded-xl font-medium hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          さらに読み込む
        </button>
      </div>
    </main>

    <!-- 予約詳細モーダル -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <!-- モーダルヘッダー -->
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-lg font-semibold text-gray-900">
            予約詳細
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- モーダルコンテンツ -->
        <div v-if="selectedReservation" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 予約情報 -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">予約情報</h4>
            
            <div class="space-y-3">
              <div>
                <span class="text-sm text-gray-500">サービス名</span>
                <p class="font-medium">{{ selectedReservation.serviceName }}</p>
              </div>
              
              <div>
                <span class="text-sm text-gray-500">店舗名</span>
                <p class="font-medium">{{ selectedReservation.storeName }}</p>
              </div>
              
              <div>
                <span class="text-sm text-gray-500">日時</span>
                <p class="font-medium">{{ formatDateTime(selectedReservation.startTime) }}</p>
              </div>
              
              <div>
                <span class="text-sm text-gray-500">所要時間</span>
                <p class="font-medium">{{ selectedReservation.durationMinutes }}分</p>
              </div>
              
              <div>
                <span class="text-sm text-gray-500">料金</span>
                <p class="font-medium">¥{{ selectedReservation.price.toLocaleString() }}</p>
              </div>
              
              <div>
                <span class="text-sm text-gray-500">ステータス</span>
                <span
                  :class="{
                    'bg-orange-100 text-orange-800': selectedReservation.status === 'pending',
                    'bg-green-100 text-green-800': selectedReservation.status === 'confirmed',
                    'bg-red-100 text-red-800': selectedReservation.status === 'cancelled'
                  }"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getStatusText(selectedReservation.status) }}
                </span>
              </div>
              
              <div v-if="selectedReservation.notes">
                <span class="text-sm text-gray-500">備考</span>
                <p class="font-medium">{{ selectedReservation.notes }}</p>
              </div>
            </div>
          </div>

          <!-- チャットセクション -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-4">チャット</h4>
            
            <!-- メッセージ一覧 -->
            <div class="h-64 overflow-y-auto bg-white rounded border p-3 mb-3">
              <div v-if="loadingMessages" class="text-center text-gray-500">
                メッセージを読み込み中...
              </div>
              
              <div v-else-if="messages.length === 0" class="text-center text-gray-500">
                まだメッセージがありません
              </div>
              
              <div v-else class="space-y-2">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  :class="(message.sender_type || message.senderType) === 'customer' ? 'text-right' : 'text-left'"
                  class="pb-2 border-b border-gray-200 last:border-b-0"
                >
                  <div
                    :class="(message.sender_type || message.senderType) === 'customer' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'"
                    class="inline-block px-3 py-2 rounded-lg max-w-xs"
                  >
                    <p class="text-sm">{{ message.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ message.sender_name || message.senderName }} - {{ formatDateTime(message.createdAt || message.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- メッセージ送信フォーム -->
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="メッセージを入力..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="sendingMessage"
              >
              <button
                type="submit"
                :disabled="!newMessage.trim() || sendingMessage"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ sendingMessage ? '送信中...' : '送信' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth'
})

// データ
const reservations = ref([])
const selectedStatus = ref('')
const loading = ref(false)
const error = ref('')
const offset = ref(0)
const limit = 20

// モーダル関連
const showModal = ref(false)
const selectedReservation = ref(null)
const messages = ref([])
const newMessage = ref('')
const loadingMessages = ref(false)
const sendingMessage = ref(false)

// 予約履歴を取得
const loadReservations = async (reset = true) => {
  if (reset) {
    offset.value = 0
    reservations.value = []
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.value.toString()
    })
    
    if (selectedStatus.value) {
      params.append('status', selectedStatus.value)
    }
    
    const response = await $fetch(`/api/customer/reservations?${params}`, {
      credentials: 'include'
    })
    
    if (reset) {
      reservations.value = response.reservations
    } else {
      reservations.value.push(...response.reservations)
    }
    
    offset.value += limit
  } catch (err) {
    error.value = err.data?.message || '予約履歴の取得に失敗しました'
  } finally {
    loading.value = false
  }
}

// さらに読み込み
const loadMoreReservations = () => {
  loadReservations(false)
}

// 予約キャンセル
const cancelReservation = async (reservationId) => {
  if (!confirm('この予約をキャンセルしますか？')) {
    return
  }
  
  try {
    await $fetch(`/api/customer/reservations/${reservationId}/cancel`, {
      method: 'POST',
      credentials: 'include'
    })
    
    // 予約一覧を再読み込み
    await loadReservations()
    alert('予約をキャンセルしました')
  } catch (err) {
    alert(err.data?.message || '予約のキャンセルに失敗しました')
  }
}

// キャンセル可能かチェック（24時間前まで）
const canCancel = (startTime) => {
  const now = new Date()
  const reservationTime = new Date(startTime)
  const hoursDiff = (reservationTime - now) / (1000 * 60 * 60)
  return hoursDiff > 24
}

// ステータステキスト取得
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '承認待ち'
    case 'confirmed':
      return '確定'
    case 'cancelled':
      return 'キャンセル'
    default:
      return status
  }
}

// 日時フォーマット
const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 日付フォーマット
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 詳細モーダル表示
const showDetails = async (reservation) => {
  selectedReservation.value = reservation
  showModal.value = true
  await loadMessages()
}

// モーダル閉じる
const closeModal = () => {
  showModal.value = false
  selectedReservation.value = null
  messages.value = []
  newMessage.value = ''
}

// メッセージ読み込み
const loadMessages = async () => {
  if (!selectedReservation.value) return
  
  loadingMessages.value = true
  try {
    const response = await $fetch(`/api/reservations/${selectedReservation.value.id}/messages`, {
      credentials: 'include'
    })
    messages.value = response.messages || []
  } catch (err) {
    console.error('メッセージの読み込みに失敗しました:', err)
    messages.value = []
  } finally {
    loadingMessages.value = false
  }
}

// メッセージ送信
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedReservation.value) return
  
  sendingMessage.value = true
  try {
    await $fetch(`/api/reservations/${selectedReservation.value.id}/messages`, {
      method: 'POST',
      credentials: 'include',
      body: {
        message: newMessage.value.trim()
      }
    })
    
    newMessage.value = ''
    await loadMessages()
  } catch (err) {
    alert(err.data?.message || 'メッセージの送信に失敗しました')
  } finally {
    sendingMessage.value = false
  }
}

// 時刻フォーマット
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初期データ読み込み
onMounted(() => {
  loadReservations()
})
</script>