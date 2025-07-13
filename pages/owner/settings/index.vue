<template>
  <div class="space-y-6">
      <!-- ヘッダー -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">店舗設定</h1>
            <p class="text-gray-600 mt-1">店舗情報と営業時間を管理できます</p>
          </div>
          <NuxtLink 
            to="/profile"
            class="text-blue-600 hover:text-blue-900 text-sm"
          >
            個人設定はこちら
          </NuxtLink>
        </div>
      </div>

      <!-- 店舗設定 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">店舗情報</h2>
        
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- 店舗画像 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">店舗画像</label>
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  alt="店舗画像"
                  class="w-full h-full object-cover"
                >
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="space-y-2">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                >
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  画像を選択
                </button>
                <button
                  v-if="profileImageUrl"
                  type="button"
                  @click="removeProfileImage"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  画像を削除
                </button>
              </div>
            </div>
          </div>
          
          <!-- 店舗名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">店舗名</label>
            <input
              v-model="profileData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="店舗名を入力"
            >
          </div>
          
          <!-- 説明 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">店舗説明</label>
            <textarea
              v-model="profileData.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="店舗の説明を入力"
            ></textarea>
          </div>
          
          <div v-if="profileError" class="text-red-600 text-sm">
            {{ profileError }}
          </div>
          
          <button
            type="submit"
            :disabled="profileLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
          >
            {{ profileLoading ? '保存中...' : '店舗情報を保存' }}
          </button>
        </form>
      </div>

      <!-- 営業時間設定 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">営業時間設定</h2>
        
        <form @submit.prevent="saveBusinessHours" class="space-y-4">
          <div
            v-for="(day, key) in businessHours"
            :key="key"
            class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
          >
            <div class="w-20">
              <span class="font-medium text-gray-700">{{ getDayName(key) }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <input
                v-model="day.isOpen"
                type="checkbox"
                class="h-4 w-4 text-blue-600 rounded"
              >
              <span class="text-sm text-gray-600">営業</span>
            </div>
            
            <div v-if="day.isOpen" class="flex items-center space-x-2">
              <input
                v-model="day.openTime"
                type="time"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <span class="text-gray-500">〜</span>
              <input
                v-model="day.closeTime"
                type="time"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <div v-else class="text-gray-400">
              休業日
            </div>
          </div>
          
          <div v-if="hoursError" class="text-red-600 text-sm">
            {{ hoursError }}
          </div>
          
          <button
            type="submit"
            :disabled="hoursLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
          >
            {{ hoursLoading ? '保存中...' : '営業時間を保存' }}
          </button>
        </form>
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
const profileData = ref({
  name: '',
  description: ''
})

const businessHours = ref({
  monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  sunday: { isOpen: false, openTime: null, closeTime: null }
})

const profileImageUrl = ref('')
const profileLoading = ref(false)
const hoursLoading = ref(false)
const profileError = ref('')
const hoursError = ref('')

// 曜日名取得
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

// 画像アップロード
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // ファイルサイズチェック（5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズは5MB以下にしてください')
    return
  }
  
  // ファイル形式チェック
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください')
    return
  }
  
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await $fetch('/api/owner/profile/image', {
      method: 'POST',
      body: formData
    })
    
    profileImageUrl.value = response.imageUrl
  } catch (err) {
    alert('画像のアップロードに失敗しました')
  }
}

// 画像削除
const removeProfileImage = async () => {
  if (!confirm('プロフィール画像を削除しますか？')) return
  
  try {
    await $fetch('/api/owner/profile/image', {
      method: 'DELETE'
    })
    profileImageUrl.value = ''
  } catch (err) {
    alert('画像の削除に失敗しました')
  }
}

// プロフィール保存
const saveProfile = async () => {
  profileLoading.value = true
  profileError.value = ''
  
  try {
    await $fetch('/api/owner/profile', {
      method: 'PUT',
      body: {
        name: profileData.value.name,
        description: profileData.value.description
      }
    })
    
    alert('プロフィールを保存しました')
  } catch (err) {
    profileError.value = err.data?.message || 'エラーが発生しました'
  } finally {
    profileLoading.value = false
  }
}

// 営業時間保存
const saveBusinessHours = async () => {
  hoursLoading.value = true
  hoursError.value = ''
  
  try {
    await $fetch('/api/owner/profile', {
      method: 'PUT',
      body: {
        business_hours: businessHours.value
      }
    })
    
    alert('営業時間を保存しました')
  } catch (err) {
    hoursError.value = err.data?.message || 'エラーが発生しました'
  } finally {
    hoursLoading.value = false
  }
}

// プロフィール取得
const loadProfile = async () => {
  try {
    const response = await $fetch('/api/owner/profile')
    
    profileData.value.name = response.name || ''
    profileData.value.description = response.description || ''
    profileImageUrl.value = response.profileImageUrl || ''
    
    if (response.businessHours) {
      businessHours.value = response.businessHours
    }
  } catch (err) {
    console.error('プロフィール取得エラー:', err)
  }
}

// 初期データの取得
onMounted(() => {
  loadProfile()
})
</script>