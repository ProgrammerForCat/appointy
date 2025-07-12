<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-100">
      <!-- ヘッダー -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-2xl font-bold text-gray-900">プロフィール設定</h1>
            <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
              ダッシュボードに戻る
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- プロフィール設定 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">個人情報</h2>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- プロフィール画像 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">プロフィール画像</label>
              <div class="flex items-center space-x-4">
                <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    v-if="profileImageUrl"
                    :src="profileImageUrl"
                    alt="プロフィール画像"
                    class="w-full h-full object-cover"
                  >
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="space-y-2">
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
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    画像を選択
                  </button>
                  <button
                    v-if="profileImageUrl"
                    type="button"
                    @click="removeProfileImage"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm ml-2"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>

            <!-- 名前 -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">名前</label>
              <input
                v-model="profileData.name"
                type="text"
                id="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <!-- メールアドレス -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
              <input
                v-model="profileData.email"
                type="email"
                id="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <!-- 電話番号 -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
              <input
                v-model="profileData.phone"
                type="tel"
                id="phone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <!-- 保存ボタン -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
              >
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>

        <!-- パスワード変更セクション -->
        <div class="bg-white shadow rounded-lg p-6 mt-6">
          <div class="flex justify-between items-center cursor-pointer" @click="showPasswordModal = true">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">パスワード変更</h2>
              <p class="text-gray-600 text-sm mt-1">アカウントのセキュリティを保護するためパスワードを変更できます</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <!-- パスワード変更モーダル -->
        <Modal v-model="showPasswordModal" title="パスワード変更">
          <form @submit.prevent="changePassword" class="space-y-6">
            <!-- 現在のパスワード -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">現在のパスワード</label>
              <input
                v-model="passwordData.currentPassword"
                type="password"
                id="currentPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <!-- 新しいパスワード -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
              <input
                v-model="passwordData.newPassword"
                type="password"
                id="newPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <!-- パスワード確認 -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">パスワード確認</label>
              <input
                v-model="passwordData.confirmPassword"
                type="password"
                id="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
          </form>

          <template #footer>
            <div class="flex justify-end gap-4">
              <button
                @click="showPasswordModal = false"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                @click="changePassword"
                :disabled="changingPassword"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ changingPassword ? '変更中...' : 'パスワード変更' }}
              </button>
            </div>
          </template>
        </Modal>
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth'
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
    console.error('プロフィール取得エラー:', error)
  }
})
</script>