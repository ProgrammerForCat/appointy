<template>
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ログイン
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は
          <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            新規登録
          </NuxtLink>
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'ログイン中...' : 'ログイン' }}
          </button>
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
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    // リダイレクト先を判定（店舗がある場合は店舗ダッシュボード、ない場合はユーザーダッシュボード）
    const redirect = route.query.redirect || (response.user.hasStore ? '/owner/dashboard' : '/dashboard')
    await navigateTo(redirect)
  } catch (err) {
    error.value = err.data?.message || 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}
</script>