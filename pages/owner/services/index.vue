<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100">
    <div class="space-y-6">
      <!-- ヘッダー -->
      <div class="bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl p-8">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">サービス管理</h1>
          <button
            @click="showCreateModal = true"
            class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>新しいサービス</span>
          </button>
        </div>
      </div>

        <!-- サービス一覧 -->
        <div class="bg-white backdrop-blur-sm border border-gray-300 rounded-2xl shadow-xl">
          <div class="px-8 py-6 border-b border-gray-200/50">
            <h2 class="text-2xl font-bold text-gray-900">サービス一覧</h2>
          </div>
          
          <div v-if="services.length > 0" class="divide-y divide-gray-200/50">
            <div
              v-for="service in services"
              :key="service.id"
              class="p-6 hover:bg-gray-50 transition-all duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-bold text-gray-900">{{ service.name }}</h3>
                    <span class="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-sm">
                      {{ service.category || 'その他' }}
                    </span>
                    <span
                      :class="service.isActive ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : 'bg-gradient-to-r from-red-400 to-red-500 text-white'"
                      class="px-3 py-1 text-xs font-medium rounded-full shadow-sm"
                    >
                      {{ service.isActive ? '有効' : '無効' }}
                    </span>
                  </div>
                  <div class="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                    <span class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>所要時間: {{ service.durationMinutes }}分</span>
                    </span>
                    <span class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>料金: ¥{{ service.price.toLocaleString() }}</span>
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <button
                    @click="editService(service)"
                    class="px-4 py-2 text-blue-600 hover:text-blue-500 font-medium transition-colors rounded-lg hover:bg-blue-50"
                  >
                    編集
                  </button>
                  <button
                    @click="toggleServiceStatus(service)"
                    :class="service.isActive ? 'text-red-600 hover:text-red-500 hover:bg-red-50' : 'text-green-600 hover:text-green-500 hover:bg-green-50'"
                    class="px-4 py-2 font-medium transition-colors rounded-lg"
                  >
                    {{ service.isActive ? '無効化' : '有効化' }}
                  </button>
                  <button
                    @click="deleteService(service)"
                    class="px-4 py-2 text-red-600 hover:text-red-500 font-medium transition-colors rounded-lg hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="p-16 text-center">
            <div class="text-gray-400 text-6xl mb-4">🔧</div>
            <p class="text-gray-500 text-lg mb-2">サービスがありません</p>
            <p class="text-gray-400 text-sm">新しいサービスを作成してください</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 作成・編集モーダル -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-2xl bg-white">
        <div class="mt-3">
          <h3 class="text-xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {{ showCreateModal ? '新しいサービス' : 'サービス編集' }}
          </h3>
          
          <form @submit.prevent="saveService" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">サービス名</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                placeholder="例: カウンセリング"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <div v-if="showEditModal" class="mb-2 text-sm text-gray-600">
                現在のカテゴリ: <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ editingService?.category || 'その他' }}</span>
              </div>
              <select
                v-model="formData.category"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
              >
                <option value="">カテゴリを選択してください</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <p class="mt-1 text-sm text-gray-500">
                カテゴリは予約ページでサービスを分類・検索するために使用されます
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">所要時間（分）</label>
              <input
                v-model.number="formData.duration_minutes"
                type="number"
                min="1"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:scale-100"
              >
                {{ loading ? '保存中...' : '保存' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
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

// カテゴリ一覧
const categories = ref([
  '美容・ヘアケア',
  'ネイル',
  'リラクゼーション', 
  'ヘルス・フィットネス',
  'レッスン・教室',
  'コンサルティング',
  'その他'
])

const formData = ref({
  name: '',
  category: '',
  duration_minutes: 60,
  price: 0,
  is_active: true
})

// フォームリセット
const resetForm = () => {
  formData.value = {
    name: '',
    category: '',
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
    category: service.category || 'その他',
    duration_minutes: service.durationMinutes,
    price: service.price,
    is_active: Boolean(service.isActive) // 数値をbooleanに変換
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
        category: service.category || 'その他',
        duration_minutes: service.durationMinutes,
        price: service.price,
        is_active: service.isActive ? false : true // 数値を考慮した boolean 変換
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