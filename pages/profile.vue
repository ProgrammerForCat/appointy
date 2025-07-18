<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- ページヘッダー -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">プロフィール設定</h1>
          <NuxtLink to="/dashboard" class="flex items-center text-blue-600 hover:text-blue-500 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- プロフィール設定 -->
      <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-2xl opacity-50"></div>
        <div class="relative">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">個人情報</h2>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- プロフィール画像 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">プロフィール画像</label>
              <div class="flex items-center space-x-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                  <img
                    v-if="profileImageUrl"
                    :src="profileImageUrl"
                    alt="プロフィール画像"
                    class="w-full h-full object-cover"
                  >
                  <svg v-else class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="space-y-3">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  >
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    画像を選択
                  </button>
                  <button
                    v-if="profileImageUrl"
                    type="button"
                    @click="removeProfileImage"
                    class="bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm font-medium ml-2 transition-all duration-200 hover:scale-105"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>

            <!-- 名前 -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">名前</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  v-model="profileData.name"
                  type="text"
                  id="name"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="お名前を入力"
                  required
                >
              </div>
            </div>

            <!-- メールアドレス -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  v-model="profileData.email"
                  type="email"
                  id="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="メールアドレスを入力"
                  required
                >
              </div>
            </div>

            <!-- 電話番号 -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  v-model="profileData.phone"
                  type="tel"
                  id="phone"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="電話番号を入力"
                >
              </div>
            </div>

            <!-- 保存ボタン -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 hover:scale-105"
              >
                <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- パスワード変更セクション -->
      <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8 mt-6">
        <div class="flex justify-between items-center cursor-pointer hover:bg-white/30 rounded-xl p-4 transition-all duration-200" @click="showPasswordModal = true">
          <div>
            <h2 class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">パスワード変更</h2>
            <p class="text-gray-600 text-sm mt-1">アカウントのセキュリティを保護するためパスワードを変更できます</p>
          </div>
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- パスワード変更モーダル -->
      <Modal v-model="showPasswordModal" title="パスワード変更">
        <form @submit.prevent="changePassword" class="space-y-6">
          <!-- 現在のパスワード -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">現在のパスワード</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="passwordData.currentPassword"
                type="password"
                id="currentPassword"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="現在のパスワードを入力"
                required
              >
            </div>
          </div>

          <!-- 新しいパスワード -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="passwordData.newPassword"
                type="password"
                id="newPassword"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="新しいパスワードを入力"
                required
              >
            </div>
          </div>

          <!-- パスワード確認 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">パスワード確認</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                v-model="passwordData.confirmPassword"
                type="password"
                id="confirmPassword"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="パスワードを再入力"
                required
              >
            </div>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-4">
            <button
              @click="showPasswordModal = false"
              class="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              @click="changePassword"
              :disabled="changingPassword"
              class="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 hover:scale-105"
            >
              <svg v-if="changingPassword" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2H7v-2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              {{ changingPassword ? '変更中...' : 'パスワード変更' }}
            </button>
          </div>
        </template>
      </Modal>
    </main>
  </div>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// データの定義
const profileData = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileImageUrl = ref('')
const saving = ref(false)
const changingPassword = ref(false)
const showPasswordModal = ref(false)

// プロフィール情報を保存
const saveProfile = async () => {
  saving.value = true
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: profileData.value
    })
    alert('プロフィールを更新しました')
  } catch (error) {
    alert('保存に失敗しました: ' + (error.data?.message || error.message))
  } finally {
    saving.value = false
  }
}

// パスワード変更
const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert('新しいパスワードが一致しません')
    return
  }

  changingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      body: {
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword
      }
    })
    showPasswordModal.value = false
    alert('パスワードを変更しました')
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    alert('変更に失敗しました: ' + (error.data?.message || error.message))
  } finally {
    changingPassword.value = false
  }
}

// 画像アップロード
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await $fetch('/api/profile/image', {
      method: 'POST',
      body: formData
    })
    profileImageUrl.value = response.imageUrl
    alert('画像をアップロードしました')
  } catch (error) {
    alert('アップロードに失敗しました: ' + (error.data?.message || error.message))
  }
}

// プロフィール画像削除
const removeProfileImage = async () => {
  try {
    await $fetch('/api/profile/image', {
      method: 'DELETE'
    })
    profileImageUrl.value = ''
    alert('画像を削除しました')
  } catch (error) {
    alert('削除に失敗しました: ' + (error.data?.message || error.message))
  }
}

// 初期データの取得
onMounted(async () => {
  try {
    const user = await $fetch('/api/auth/me')
    profileData.value = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    }
    profileImageUrl.value = user.profileImageUrl || ''
  } catch (error) {
    // プロフィール取得エラー
  }
})
</script>