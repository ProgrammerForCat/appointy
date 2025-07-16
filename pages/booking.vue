<template>
  <div>
    <!-- 来た場所に応じてヘッダーを切り替え -->
    <AppHeader :user-type="headerMode" :key="headerMode + '-booking'" />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- サービス検索画面ヘッダー -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">サービス予約</h1>
          <p class="text-gray-600">お好みのサービスを選択して予約してください</p>
        </div>
      </div>

      <!-- カテゴリフィルター -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">カテゴリから探す</h2>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = ''"
            :class="selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            すべて
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- サービス一覧 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ selectedCategory ? `${selectedCategory}のサービス` : '提供サービス' }}
          <span class="text-sm text-gray-500">({{ filteredServices.length }}件)</span>
        </h2>
        <div v-if="filteredServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="service in filteredServices" 
            :key="service.id"
            :to="`/store/${service.storeId}/service/${service.id}`"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ service.category || 'その他' }}
              </span>
            </div>
            <p class="text-blue-600 text-sm font-medium">{{ service.storeName }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ service.durationMinutes }}分</p>
            <p class="text-blue-600 font-bold mt-2">¥{{ service.price.toLocaleString() }}</p>
          </NuxtLink>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          {{ selectedCategory ? `${selectedCategory}のサービスはありません。` : '現在、提供可能なサービスはありません。' }}
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
const selectedCategory = ref('')

// 計算プロパティ
const filteredServices = computed(() => {
  if (!selectedCategory.value) {
    return services.value
  }
  return services.value.filter(service => service.category === selectedCategory.value)
})

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