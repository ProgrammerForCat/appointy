<template>
  <NuxtLayout name="default">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- サービス検索画面ヘッダー -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">サービス予約</h1>
          <p class="text-gray-600">お好みのサービスを選択して予約してください</p>
        </div>
      </div>

      <!-- サービス一覧 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">提供サービス</h2>
        <div v-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
            @click="selectService(service)"
          >
            <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
            <p class="text-blue-600 text-sm font-medium">{{ service.storeName }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ service.durationMinutes }}分</p>
            <p class="text-blue-600 font-bold mt-2">¥{{ service.price.toLocaleString() }}</p>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          現在、提供可能なサービスはありません。
        </div>
      </div>

      <!-- 予約フォーム -->
      <div v-if="selectedService" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">予約フォーム</h2>
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
            <p><span class="font-medium">サービス:</span> {{ selectedService.name }}</p>
            <p><span class="font-medium">日時:</span> {{ selectedDate }} {{ formatTime(selectedTime) }}</p>
            <p><span class="font-medium">所要時間:</span> {{ selectedService.durationMinutes }}分</p>
            <p><span class="font-medium">料金:</span> ¥{{ selectedService.price.toLocaleString() }}</p>
          </div>
        </div>

        <!-- 予約ボタン -->
        <div class="mt-6">
          <button 
            v-if="isAuthenticated"
            @click="createReservation"
            :disabled="!canReserve"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            予約する
          </button>
          <NuxtLink
            v-else
            to="/login?redirect=/booking"
            class="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            ログインして予約する
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// 認証
const { checkAuth } = useAuth()
const isAuthenticated = ref(false)

// データの定義
const services = ref([])
const selectedService = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const availableSlots = ref([])

// 今日の日付を取得
const today = new Date().toISOString().split('T')[0]

// 計算プロパティ
const canReserve = computed(() => {
  return selectedService.value && selectedDate.value && selectedTime.value && isAuthenticated.value
})


// 時間をフォーマット
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// サービス選択
const selectService = (service) => {
  selectedService.value = service
  selectedDate.value = ''
  selectedTime.value = ''
  availableSlots.value = []
}

// 予約可能時間の取得
const loadAvailableSlots = async () => {
  if (!selectedService.value || !selectedDate.value) return
  
  try {
    const response = await $fetch('/api/public/available-slots', {
      query: {
        serviceId: selectedService.value.id,
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
        service_id: selectedService.value.id,
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
    
    // サービス一覧を取得
    const serviceResponse = await $fetch('/api/public/services')
    services.value = serviceResponse.services
  } catch (error) {
    // データ取得エラー時は何もしない
  }
})
</script>