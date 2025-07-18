<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 来た場所に応じてヘッダーを切り替え -->
    <AppHeader :user-type="headerMode" :key="headerMode + '-booking'" />
    
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- サービス検索画面ヘッダー -->
      <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
        <div class="relative text-center">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            サービス予約
          </h1>
          <p class="text-gray-600 text-lg">お好みのサービスを選択して予約してください</p>
        </div>
      </div>

      <!-- 検索・フィルター -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <!-- フリーワード検索 -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">サービスを検索</h2>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="サービス名、店舗名で検索..."
              class="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400"
            >
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- カテゴリフィルター -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">カテゴリから探す</h2>
          <div class="flex flex-wrap gap-3">
            <button
              @click="selectedCategory = ''"
              :class="selectedCategory === '' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 border border-gray-200'"
              class="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            >
              すべて
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="selectedCategory === category ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 border border-gray-200'"
              class="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- サービス一覧 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ getResultTitle() }}
          <span class="text-base text-gray-500 font-normal ml-2">({{ filteredServices.length }}件)</span>
        </h2>
        <div v-if="filteredServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="service in filteredServices" 
            :key="service.id"
            :to="`/store/${service.storeId}/service/${service.id}`"
            class="group relative bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 hover:shadow-xl hover:scale-105 hover:bg-white/90 cursor-pointer transition-all duration-300 hover:border-blue-300/50"
          >
            <!-- グラデーションオーバーレイ -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ service.name }}</h3>
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                  {{ service.category || 'その他' }}
                </span>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center text-blue-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1M9 16h1"></path>
                  </svg>
                  <span class="text-sm font-medium">{{ service.storeName }}</span>
                </div>
                
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-sm">{{ service.durationMinutes }}分</span>
                </div>
                
                <div class="pt-2 border-t border-gray-200/50">
                  <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-gray-900">¥{{ service.price.toLocaleString() }}</span>
                    <div class="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span class="text-sm font-medium mr-1">予約する</span>
                      <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="text-center py-16">
          <div class="text-gray-400 text-6xl mb-4">🔍</div>
          <p class="text-gray-500 text-lg">{{ getNoResultMessage() }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// レイアウトなしに設定（独自ヘッダーを使用）
definePageMeta({
  layout: false
})

// 認証
const { checkAuth } = useAuth()
const isAuthenticated = ref(false)

// ヘッダーモードの判定
const headerMode = ref('customer')

// どこから来たかを判定する関数
const determineHeaderMode = () => {
  const route = useRoute()
  const router = useRouter()
  
  // URLパラメータでモードが指定されている場合
  if (route.query.mode === 'owner') {
    headerMode.value = 'owner'
    return
  }
  
  // リファラーを確認（オーナーページから来た場合）
  if (process.client) {
    const referrer = document.referrer
    if (referrer.includes('/owner/')) {
      headerMode.value = 'owner'
      return
    }
  }
  
  // デフォルトはお客さまモード
  headerMode.value = 'customer'
}

// データの定義
const services = ref([])

// 検索・フィルター関連
const searchQuery = ref('')
const selectedCategory = ref('')

// カテゴリ関連
const categories = ref([
  '美容・ヘアケア',
  'ネイル',
  'リラクゼーション',
  'ヘルス・フィットネス',
  'レッスン・教室',
  'コンサルティング',
  'その他'
])

// 計算プロパティ
const filteredServices = computed(() => {
  let filtered = services.value
  
  // 検索クエリでフィルタリング
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(query) ||
      service.storeName.toLowerCase().includes(query) ||
      (service.description && service.description.toLowerCase().includes(query)) ||
      (service.category && service.category.toLowerCase().includes(query))
    )
  }
  
  // カテゴリでフィルタリング
  if (selectedCategory.value) {
    filtered = filtered.filter(service => service.category === selectedCategory.value)
  }
  
  return filtered
})

// 結果タイトルを取得
const getResultTitle = () => {
  if (searchQuery.value.trim()) {
    if (selectedCategory.value) {
      return `「${searchQuery.value}」の検索結果（${selectedCategory.value}）`
    }
    return `「${searchQuery.value}」の検索結果`
  }
  if (selectedCategory.value) {
    return `${selectedCategory.value}のサービス`
  }
  return '提供サービス'
}

// 結果なしメッセージを取得
const getNoResultMessage = () => {
  if (searchQuery.value.trim()) {
    if (selectedCategory.value) {
      return `「${searchQuery.value}」に該当する${selectedCategory.value}のサービスはありません。`
    }
    return `「${searchQuery.value}」に該当するサービスはありません。`
  }
  if (selectedCategory.value) {
    return `${selectedCategory.value}のサービスはありません。`
  }
  return '現在、提供可能なサービスはありません。'
}

// 初期データの取得
onMounted(async () => {
  try {
    // ヘッダーモードを判定
    determineHeaderMode()
    
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