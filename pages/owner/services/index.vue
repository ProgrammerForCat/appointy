<template>
  <div class="space-y-6">
      <!-- ヘッダー -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">サービス管理</h1>
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>新しいサービス</span>
          </button>
        </div>
      </div>

      <!-- サービス一覧 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">サービス一覧</h2>
        </div>
        
        <div v-if="services.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="service in services"
            :key="service.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ service.name }}</h3>
                  <span
                    :class="service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ service.isActive ? '有効' : '無効' }}
                  </span>
                </div>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>所要時間: {{ service.durationMinutes }}分</span>
                  <span>料金: ¥{{ service.price.toLocaleString() }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editService(service)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  編集
                </button>
                <button
                  @click="toggleServiceStatus(service)"
                  :class="service.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                >
                  {{ service.isActive ? '無効化' : '有効化' }}
                </button>
                <button
                  @click="deleteService(service)"
                  class="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="p-6 text-center text-gray-500">
          サービスがありません。新しいサービスを作成してください。
        </div>
      </div>
    </div>

    <!-- 作成・編集モーダル -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? '新しいサービス' : 'サービス編集' }}
          </h3>
          
          <form @submit.prevent="saveService" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">サービス名</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: カウンセリング"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">所要時間（分）</label>
              <input
                v-model.number="formData.duration_minutes"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">料金（円）</label>
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              >
            </div>
            
            <div class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 rounded"
              >
              <label class="ml-2 text-sm text-gray-700">有効</label>
            </div>
            
            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
              >
                {{ loading ? '保存中...' : '保存' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
              >
                キャンセル
              </button>
            </div>
          </form>
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
const services = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingService = ref(null)
const loading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  duration_minutes: 60,
  price: 0,
  is_active: true
})

// フォームリセット
const resetForm = () => {
  formData.value = {
    name: '',
    duration_minutes: 60,
    price: 0,
    is_active: true
  }
  error.value = ''
}

// モーダル閉じる
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingService.value = null
  resetForm()
}

// サービス編集
const editService = (service) => {
  editingService.value = service
  formData.value = {
    name: service.name,
    duration_minutes: service.durationMinutes,
    price: service.price,
    is_active: service.isActive
  }
  showEditModal.value = true
}

// サービス保存
const saveService = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (showCreateModal.value) {
      // 新規作成
      await $fetch('/api/owner/services', {
        method: 'POST',
        body: formData.value
      })
    } else {
      // 更新
      await $fetch(`/api/owner/services/${editingService.value.id}`, {
        method: 'PUT',
        body: formData.value
      })
    }
    
    closeModal()
    await loadServices()
  } catch (err) {
    error.value = err.data?.message || 'エラーが発生しました'
  } finally {
    loading.value = false
  }
}

// サービス状態切り替え
const toggleServiceStatus = async (service) => {
  try {
    await $fetch(`/api/owner/services/${service.id}`, {
      method: 'PUT',
      body: {
        name: service.name,
        duration_minutes: service.durationMinutes,
        price: service.price,
        is_active: !service.isActive
      }
    })
    await loadServices()
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// サービス削除
const deleteService = async (service) => {
  if (!confirm(`「${service.name}」を削除しますか？`)) return
  
  try {
    await $fetch(`/api/owner/services/${service.id}`, {
      method: 'DELETE'
    })
    await loadServices()
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// サービス一覧取得
const loadServices = async () => {
  try {
    const response = await $fetch('/api/owner/services')
    services.value = response.services
  } catch (err) {
    console.error('サービス取得エラー:', err)
  }
}

// 初期データの取得
onMounted(() => {
  loadServices()
})
</script>