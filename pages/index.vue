<template>
  <NuxtLayout name="default">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 店舗情報 -->
      <div v-if="profile" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center space-x-4">
          <img 
            v-if="profile.profileImageUrl" 
            :src="profile.profileImageUrl" 
            :alt="profile.name"
            class="w-16 h-16 rounded-full object-cover"
          >
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center" v-else>
            <span class="text-gray-500 text-xl">{{ profile.name.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ profile.name }}</h1>
            <p v-if="profile.description" class="text-gray-600 mt-1">{{ profile.description }}</p>
          </div>
        </div>
        
        <!-- 営業時間 -->
        <div v-if="profile.businessHours" class="mt-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">営業時間</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(day, key) in profile.businessHours" :key="key" class="text-sm">
              <div class="font-medium text-gray-700">{{ getDayName(key) }}</div>
              <div class="text-gray-600">
                {{ day.isOpen ? `${day.openTime} - ${day.closeTime}` : '休業' }}
              </div>
            </div>
          </div>
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

        <!-- 顧客情報 -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">お名前</label>
            <input 
              v-model="customerName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田太郎"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
            <input 
              v-model="customerEmail"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@example.com"
            >
          </div>
        </div>

        <!-- 予約ボタン -->
        <div class="mt-6">
          <button 
            @click="createReservation"
            :disabled="!canReserve"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            予約する
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// データの定義
const profile = ref(null)
const services = ref([])
const selectedService = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const availableSlots = ref([])
const customerName = ref('')
const customerEmail = ref('')

// 今日の日付を取得
const today = new Date().toISOString().split('T')[0]

// 計算プロパティ
const canReserve = computed(() => {
  return selectedService.value && selectedDate.value && selectedTime.value && 
         customerName.value && customerEmail.value
})

// 曜日名を取得
const getDayName = (key) => {
  const dayNames = {
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日'
  }
  return dayNames[key] || key
}

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
    console.error('予約可能時間の取得エラー:', error)
  }
}

// 予約作成
const createReservation = async () => {
  try {
    const response = await $fetch('/api/public/reservations', {
      method: 'POST',
      body: {
        service_id: selectedService.value.id,
        customer_name: customerName.value,
        customer_email: customerEmail.value,
        start_time: selectedTime.value
      }
    })
    
    alert('予約が完了しました！')
    
    // フォームをリセット
    selectedService.value = null
    selectedDate.value = ''
    selectedTime.value = ''
    availableSlots.value = []
    customerName.value = ''
    customerEmail.value = ''
  } catch (error) {
    console.error('予約作成エラー:', error)
    alert('予約に失敗しました。もう一度お試しください。')
  }
}

// 初期データの取得
onMounted(async () => {
  try {
    // 店舗プロフィールを取得
    profile.value = await $fetch('/api/public/profile')
    
    // サービス一覧を取得
    const serviceResponse = await $fetch('/api/public/services')
    services.value = serviceResponse.services
  } catch (error) {
    console.error('データ取得エラー:', error)
  }
})
</script>