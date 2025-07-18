<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- ヘッダー -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">店舗開設</h1>
          <NuxtLink to="/dashboard" class="flex items-center text-blue-600 hover:text-blue-500 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-2xl opacity-50"></div>
        <div class="relative">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">店舗情報を入力</h2>
            <p class="text-gray-600">あなたのビジネスをスタートさせましょう</p>
          </div>
        
          <form @submit.prevent="registerStore" class="space-y-6">
            <!-- 店舗名 -->
            <div>
              <label for="storeName" class="block text-sm font-medium text-gray-700 mb-2">
                店舗名 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  v-model="formData.storeName"
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="例: 田中カウンセリングルーム"
                />
              </div>
            </div>

            <!-- 説明 -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                店舗説明
              </label>
              <textarea
                v-model="formData.description"
                id="description"
                name="description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                placeholder="店舗の特徴やサービス内容について説明してください"
              />
            </div>

            <!-- デフォルトサービス作成 -->
            <div class="bg-white/50 border border-white/40 rounded-xl p-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="formData.createDefaultServices"
                    id="createDefaultServices"
                    name="createDefaultServices"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="createDefaultServices" class="font-medium text-gray-700">
                    デフォルトサービスを作成する
                  </label>
                  <p class="text-gray-500 mt-1">
                    30分、60分、90分の相談サービスが自動的に作成されます
                  </p>
                </div>
              </div>
            </div>

            <!-- 注意事項 -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-bold text-blue-800 mb-2">
                    店舗開設について
                  </h3>
                  <p class="text-sm text-blue-700">
                    店舗を開設すると、サービス管理、予約管理、営業時間設定などの機能が利用できるようになります。
                    1ユーザーにつき1店舗のみ登録可能です。
                  </p>
                </div>
              </div>
            </div>

            <!-- エラーメッセージ -->
            <div v-if="error" class="bg-red-50/80 border border-red-200 rounded-xl p-4 backdrop-blur-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-red-800 text-sm">{{ error }}</span>
              </div>
            </div>

            <!-- 送信ボタン -->
            <div class="flex justify-end space-x-4">
              <NuxtLink
                to="/dashboard"
                class="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white transition-all duration-200"
              >
                キャンセル
              </NuxtLink>
              <button
                type="submit"
                :disabled="loading"
                class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all duration-200 hover:scale-105"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ loading ? '作成中...' : '店舗を開設' }}
              </button>
            </div>
          </form>
        </div>
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
const formData = ref({
  storeName: '',
  description: '',
  createDefaultServices: true
})
const error = ref('')
const loading = ref(false)

// 店舗登録処理
const registerStore = async () => {
  error.value = ''
  
  if (!formData.value.storeName.trim()) {
    error.value = '店舗名を入力してください'
    return
  }
  
  loading.value = true
  
  try {
    const response = await $fetch('/api/store/register', {
      method: 'POST',
      body: {
        storeName: formData.value.storeName,
        description: formData.value.description,
        createDefaultServices: formData.value.createDefaultServices
      }
    })
    
    // 店舗登録成功後、店舗管理画面へリダイレクト
    await navigateTo('/owner/dashboard')
  } catch (err) {
    error.value = err.data?.message || '店舗の開設に失敗しました'
  } finally {
    loading.value = false
  }
}
</script>