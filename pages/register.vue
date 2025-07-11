<template>
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規登録
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            アカウントをお持ちの方は
            <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              ログイン
            </NuxtLink>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="register">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                お名前
              </label>
              <input
                v-model="formData.name"
                id="name"
                name="name"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="例: 山田太郎"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                v-model="formData.email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                v-model="formData.password"
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="8文字以上"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                パスワード（確認）
              </label>
              <input
                v-model="formData.confirmPassword"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? '登録中...' : '登録する' }}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// データの定義
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const error = ref('')
const loading = ref(false)

// 登録処理
const register = async () => {
  error.value = ''
  
  // パスワード確認
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'パスワードが一致しません'
    return
  }
  
  // パスワード長チェック
  if (formData.value.password.length < 8) {
    error.value = 'パスワードは8文字以上で入力してください'
    return
  }
  
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password
      }
    })
    
    // 登録成功後、ユーザーダッシュボードへリダイレクト
    await navigateTo('/dashboard')
  } catch (err) {
    error.value = err.data?.message || '登録に失敗しました'
  } finally {
    loading.value = false
  }
}
</script>