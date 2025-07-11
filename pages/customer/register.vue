<template>
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          新規アカウント登録
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          予約管理のためのアカウントを作成します
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              お名前 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="name"
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="山田太郎"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              メールアドレス <span class="text-red-500">*</span>
            </label>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="example@example.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              パスワード <span class="text-red-500">*</span>
            </label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="6文字以上"
            />
            <p class="mt-1 text-sm text-gray-500">6文字以上で入力してください</p>
          </div>
          
          <div>
            <label for="password-confirm" class="block text-sm font-medium text-gray-700">
              パスワード（確認） <span class="text-red-500">*</span>
            </label>
            <input
              v-model="passwordConfirm"
              id="password-confirm"
              name="password-confirm"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="パスワードを再入力"
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
            {{ loading ? '登録中...' : 'アカウントを作成' }}
          </button>
        </div>

        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600">
            既にアカウントをお持ちの方は
            <NuxtLink to="/customer/login" class="font-medium text-blue-600 hover:text-blue-500">
              ログイン
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

// データの定義
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

// 登録処理
const register = async () => {
  error.value = ''
  
  // バリデーション
  if (password.value !== passwordConfirm.value) {
    error.value = 'パスワードが一致しません'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'パスワードは6文字以上で入力してください'
    return
  }
  
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/customer-register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value
      }
    })
    
    // 登録成功後、自動的にログインして予約ページへ
    await navigateTo('/booking')
  } catch (err) {
    error.value = err.data?.message || '登録に失敗しました。別のメールアドレスをお試しください。'
  } finally {
    loading.value = false
  }
}
</script>