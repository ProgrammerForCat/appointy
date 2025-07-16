<template>
  <div>
    <!-- 顧客向けレイアウト -->
    <AppHeader user-type="customer" />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- サービス詳細ヘッダー -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div v-if="service" class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ service.name }}</h1>
          <p class="text-blue-600 text-lg mb-2">{{ store.name }}</p>
          <p class="text-gray-600">{{ service.description || 'サービスの詳細情報です' }}</p>
        </div>
        <div v-else class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">サービス予約</h1>
          <p class="text-gray-600">読み込み中...</p>
        </div>
      </div>

      <!-- サービス情報 -->
      <div v-if="service" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">サービス詳細</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">カテゴリ</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ service.category || 'その他' }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">所要時間</span>
              <span class="font-semibold">{{ service.durationMinutes }}分</span>
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">料金</span>
              <span class="text-blue-600 font-bold text-lg">¥{{ service.price.toLocaleString() }}</span>
            </div>
          </div>
          <div v-if="store">
            <h3 class="font-semibold text-gray-900 mb-2">店舗情報</h3>
            <div class="text-gray-600 text-sm space-y-1">
              <p><span class="font-medium">店舗名:</span> {{ store.name }}</p>
              <p v-if="store.address"><span class="font-medium">住所:</span> {{ store.address }}</p>
              <p v-if="store.phone"><span class="font-medium">電話:</span> {{ store.phone }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 予約フォーム -->
      <div v-if="service" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">予約日時を選択</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 日付選択 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">日付</label>
            <input 
              v-model="selectedDate" 
              type="date" 
              :min="today"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadAvailableSlots"
            >
          </div>
          
          <!-- 時間選択 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">時間</label>
            <select 
              v-model="selectedTime"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!availableSlots.length"
            >
              <option value="">時間を選択してください</option>
              <option 
                v-for="slot in availableSlots" 
                :key="slot.startTime"
                :value="slot.startTime"
                :disabled="!slot.available"
              >
                {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
                {{ slot.available ? '' : '(予約済み)' }}
              </option>
            </select>
          </div>
        </div>

        <!-- 予約情報確認 -->
        <div v-if="isAuthenticated && selectedDate && selectedTime" class="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">予約内容確認</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p><span class="font-medium">サービス:</span> {{ service.name }}</p>
            <p><span class="font-medium">日時:</span> {{ selectedDate }} {{ formatTime(selectedTime) }}</p>
            <p><span class="font-medium">所要時間:</span> {{ service.durationMinutes }}分</p>
            <p><span class="font-medium">料金:</span> ¥{{ service.price.toLocaleString() }}</p>
          </div>
        </div>

        <!-- 予約ボタン -->
        <div class="mt-6 flex justify-end gap-4">
          <NuxtLink
            to="/booking"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            他のサービスを見る
          </NuxtLink>
          <button 
            v-if="isAuthenticated"
            @click="createReservation"
            :disabled="!canReserve"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            予約する
          </button>
          <NuxtLink
            v-else
            :to="`/login?redirect=${route.fullPath}`"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ログインして予約する
          </NuxtLink>
        </div>
      </div>

      <!-- エラー表示 -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
// レイアウトなしに設定（独自ヘッダーを使用）
definePageMeta({
  layout: false
})

// パラメータの取得
const route = useRoute()
const storeId = route.params.storeId
const serviceId = route.params.serviceId

// 認証
const { checkAuth } = useAuth()
const isAuthenticated = ref(false)

// データの定義
const service = ref(null)
const store = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const availableSlots = ref([])
const error = ref('')

// 今日の日付を取得
const today = new Date().toISOString().split('T')[0]

// 計算プロパティ
const canReserve = computed(() => {
  return service.value && selectedDate.value && selectedTime.value && isAuthenticated.value
})

// 時間をフォーマット
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 予約可能時間の取得
const loadAvailableSlots = async () => {
  if (!service.value || !selectedDate.value) return
  
  try {
    const response = await $fetch('/api/public/available-slots', {
      query: {
        serviceId: service.value.id,
        date: selectedDate.value
      }
    })
    availableSlots.value = response.slots
    selectedTime.value = ''
  } catch (error) {
    // エラー時は空配列を設定
    availableSlots.value = []
  }
}

// 予約作成
const createReservation = async () => {
  try {
    const response = await $fetch('/api/public/reservations', {
      method: 'POST',
      credentials: 'include',
      body: {
        service_id: service.value.id,
        start_time: selectedTime.value
      }
    })
    
    alert('予約が完了しました！')
    
    // 予約履歴ページにリダイレクト
    await navigateTo('/reservations')
  } catch (error) {
    const errorMessage = error.data?.statusMessage || error.message || '予約に失敗しました。もう一度お試しください。'
    alert(errorMessage)
  }
}

// 初期データの取得
onMounted(async () => {
  try {
    // 認証状態を確認
    isAuthenticated.value = await checkAuth()
    
    // サービス詳細を取得
    const serviceResponse = await $fetch(`/api/public/services/${serviceId}`)
    service.value = serviceResponse.service
    store.value = serviceResponse.store
    
    // パラメータの検証
    if (service.value.store_id !== parseInt(storeId)) {
      error.value = 'サービスが見つかりません'
    }
  } catch (error) {
    error.value = 'サービスの読み込みに失敗しました'
  }
})
</script>