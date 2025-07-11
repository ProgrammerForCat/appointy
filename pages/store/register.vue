<template>
  <div class="min-h-screen bg-gray-100">
    <!-- ヘッダー -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">店舗開設</h1>
          <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
            ダッシュボードに戻る
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">店舗情報を入力</h2>
        
        <form @submit.prevent="registerStore" class="space-y-6">
          <!-- 店舗名 -->
          <div>
            <label for="storeName" class="block text-sm font-medium text-gray-700">
              店舗名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.storeName"
              id="storeName"
              name="storeName"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="例: 田中カウンセリングルーム"
            />
          </div>

          <!-- 説明 -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              店舗説明
            </label>
            <textarea
              v-model="formData.description"
              id="description"
              name="description"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="店舗の特徴やサービス内容について説明してください"
            />
          </div>

          <!-- デフォルトサービス作成 -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                v-model="formData.createDefaultServices"
                id="createDefaultServices"
                name="createDefaultServices"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="createDefaultServices" class="font-medium text-gray-700">
                デフォルトサービスを作成する
              </label>
              <p class="text-gray-500">
                30分、60分、90分の相談サービスが自動的に作成されます
              </p>
            </div>
          </div>

          <!-- 注意事項 -->
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  店舗開設について
                </h3>
                <p class="mt-2 text-sm text-blue-700">
                  店舗を開設すると、サービス管理、予約管理、営業時間設定などの機能が利用できるようになります。
                  1ユーザーにつき1店舗のみ登録可能です。
                </p>
              </div>
            </div>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- 送信ボタン -->
          <div class="flex justify-end space-x-4">
            <NuxtLink
              to="/dashboard"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              キャンセル
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ loading ? '作成中...' : '店舗を開設' }}
            </button>
          </div>
        </form>
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