<template>
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          カスタマーログイン
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          予約の確認・管理にログインが必要です
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">メールアドレス</label>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="メールアドレス"
            />
          </div>
          <div>
            <label for="password" class="sr-only">パスワード</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="パスワード"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? 'ログイン中...' : 'ログイン' }}
          </button>
        </div>

        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600">
            アカウントをお持ちでない方は
            <NuxtLink to="/customer/register" class="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </NuxtLink>
          </p>
          <p class="text-sm text-gray-600">
            <NuxtLink to="/" class="font-medium text-blue-600 hover:text-blue-500">
              トップページに戻る
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// definePageMetaを削除（blankレイアウトを使用）

// ルートパラメータ
const route = useRoute()

// データの定義
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// ログイン処理
const login = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/customer-login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    // リダイレクト先を判定
    const redirect = route.query.redirect || '/booking'
    await navigateTo(redirect)
  } catch (err) {
    error.value = err.data?.message || 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}
</script>