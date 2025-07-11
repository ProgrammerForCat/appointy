<template>
  <div class="min-h-screen bg-gray-100">
    <!-- ヘッダー -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">予約履歴</h1>
          <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
            ダッシュボードに戻る
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- フィルター -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              v-model="selectedStatus"
              id="status"
              @change="loadReservations"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">すべて</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="loadReservations"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              更新
            </button>
          </div>
        </div>
      </div>

      <!-- 予約一覧 -->
      <div class="space-y-4">
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ reservation.serviceName }}
                  </h3>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ reservation.storeName }}
                  </p>
                </div>
                <div class="ml-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': reservation.status === 'confirmed',
                      'bg-red-100 text-red-800': reservation.status === 'cancelled'
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">日時</span>
                  <p class="font-medium">{{ formatDateTime(reservation.startTime) }}</p>
                </div>
                <div>
                  <span class="text-gray-500">所要時間</span>
                  <p class="font-medium">{{ reservation.durationMinutes }}分</p>
                </div>
                <div>
                  <span class="text-gray-500">料金</span>
                  <p class="font-medium">¥{{ reservation.price.toLocaleString() }}</p>
                </div>
                <div>
                  <span class="text-gray-500">予約日</span>
                  <p class="font-medium">{{ formatDate(reservation.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- アクション -->
            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
              <NuxtLink
                :to="`/booking?service=${reservation.serviceId}`"
                class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 text-center"
              >
                再予約
              </NuxtLink>
              <button
                v-if="reservation.status === 'confirmed' && canCancel(reservation.startTime)"
                @click="cancelReservation(reservation.id)"
                class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>

        <!-- 空の状態 -->
        <div v-if="!loading && reservations.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">📅</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">予約履歴がありません</h3>
          <p class="text-gray-500 mb-6">まだ予約を取られていません。</p>
          <NuxtLink
            to="/booking"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            予約する
          </NuxtLink>
        </div>

        <!-- ローディング -->
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-400 text-2xl">読み込み中...</div>
        </div>

        <!-- エラー -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="text-red-800">{{ error }}</div>
          <button
            @click="loadReservations"
            class="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            再試行
          </button>
        </div>
      </div>

      <!-- もっと読み込み -->
      <div v-if="reservations.length > 0 && !loading" class="text-center mt-8">
        <button
          @click="loadMoreReservations"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          さらに読み込む
        </button>
      </div>
    </main>
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

// 初期データ読み込み
onMounted(() => {
  loadReservations()
})
</script>