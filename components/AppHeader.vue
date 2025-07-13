<template>
  <header :class="headerClasses">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- ロゴ -->
        <div class="flex items-center">
          <NuxtLink 
            :to="logoLink" 
            :class="logoClasses"
          >
            {{ logoText }}
          </NuxtLink>
        </div>

        <!-- ナビゲーション -->
        <nav class="flex space-x-4">
          <!-- ユーザー向けナビゲーション -->
          <template v-if="userType === 'customer'">
            <NuxtLink 
              to="/booking" 
              :class="linkClasses"
            >
              予約する
            </NuxtLink>
            <template v-if="isAuthenticated">
              <NuxtLink 
                to="/reservations" 
                :class="linkClasses"
              >
                予約履歴
              </NuxtLink>
              <NuxtLink 
                to="/dashboard" 
                :class="linkClasses"
              >
                マイページ
              </NuxtLink>
              <NuxtLink 
                v-if="currentUser"
                to="/profile"
                :class="linkClasses"
              >
                {{ currentUser.name }}さん
              </NuxtLink>
              <button 
                v-if="currentUser && currentUser.hasStore"
                @click="switchToOwnerMode"
                :class="[linkClasses, 'bg-blue-100 text-blue-700 px-3 py-1 rounded-md']"
              >
                店舗モードへ
              </button>
              <button 
                @click="handleLogout"
                :class="linkClasses"
              >
                ログアウト
              </button>
            </template>
            <template v-else>
              <NuxtLink 
                to="/login" 
                :class="linkClasses"
              >
                ログイン
              </NuxtLink>
            </template>
          </template>

          <!-- オーナー向けナビゲーション -->
          <template v-if="userType === 'owner'">
            <NuxtLink 
              to="/owner/dashboard" 
              :class="linkClasses"
            >
              ダッシュボード
            </NuxtLink>
            <NuxtLink 
              to="/owner/services" 
              :class="linkClasses"
            >
              サービス管理
            </NuxtLink>
            <NuxtLink 
              to="/owner/reservations" 
              :class="linkClasses"
            >
              予約管理
            </NuxtLink>
            <NuxtLink 
              to="/booking?mode=owner" 
              :class="linkClasses"
            >
              予約受付
            </NuxtLink>
            <NuxtLink 
              to="/owner/settings" 
              :class="linkClasses"
            >
              設定
            </NuxtLink>
            <button 
              @click="switchToCustomerMode"
              :class="[linkClasses, 'bg-white bg-opacity-20 px-3 py-1 rounded-md']"
            >
              お客さまモードへ
            </button>
            <button 
              @click="handleLogout" 
              :class="linkClasses"
            >
              ログアウト
            </button>
          </template>

          <!-- ダッシュボード用特別ナビゲーション（ユーザー名表示） -->
          <template v-if="userType === 'dashboard'">
            <NuxtLink 
              to="/profile"
              :class="linkClasses"
            >
              {{ userName }}さん
            </NuxtLink>
            <button
              @click="handleLogout"
              :class="linkClasses"
            >
              ログアウト
            </button>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  userType: {
    type: String,
    default: 'customer'
  },
  userName: {
    type: String,
    default: ''
  }
})

// 認証状態管理
const { checkAuth, logout: authLogout, getUser } = useAuth()
const isAuthenticated = ref(false)
const currentUser = ref(null)

// スタイル計算
const headerClasses = computed(() => {
  switch (props.userType) {
    case 'owner':
      return 'bg-blue-600 text-white'
    case 'dashboard':
      return 'bg-white shadow'
    default:
      return 'bg-white shadow-sm'
  }
})

const logoClasses = computed(() => {
  return props.userType === 'owner' 
    ? 'text-xl font-bold' 
    : 'text-xl font-bold text-gray-900'
})

const linkClasses = computed(() => {
  switch (props.userType) {
    case 'owner':
      return 'hover:text-blue-200'
    case 'dashboard':
      return 'text-gray-700 hover:text-gray-900 transition-colors cursor-pointer'
    default:
      return 'text-gray-600 hover:text-gray-900'
  }
})

const logoText = computed(() => {
  return props.userType === 'owner' ? 'Appointy 店舗' : 'Appointy'
})

const logoLink = computed(() => {
  return props.userType === 'owner' ? '/owner/dashboard' : '/'
})

// ログアウト処理
const handleLogout = async () => {
  if (props.userType === 'owner') {
    // オーナー用のログアウト処理
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await navigateTo('/owner/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  } else {
    // 一般ユーザー用のログアウト処理
    await authLogout()
    isAuthenticated.value = false
    if (props.userType === 'dashboard') {
      await navigateTo('/login')
    }
  }
}

// モード切り替え関数
const switchToOwnerMode = async () => {
  await navigateTo('/owner/dashboard')
}

const switchToCustomerMode = async () => {
  await navigateTo('/')
}

// 認証状態を更新する関数
const updateAuthState = async () => {
  if (props.userType === 'customer') {
    isAuthenticated.value = await checkAuth()
    if (isAuthenticated.value) {
      // 認証済みの場合はユーザー情報を取得
      currentUser.value = await getUser()
    } else {
      currentUser.value = null
    }
  } else if (props.userType === 'dashboard') {
    isAuthenticated.value = true // dashboardは認証済みページなので常にtrue
    currentUser.value = await getUser()
  } else if (props.userType === 'owner') {
    isAuthenticated.value = true // ownerページは認証済みページなので常にtrue
    currentUser.value = await getUser()
  }
}

// 認証状態を確認
onMounted(async () => {
  await updateAuthState()
})

// userTypeプロパティが変更されたときに認証状態を更新
watch(() => props.userType, async () => {
  await updateAuthState()
})

// ページ変更時に認証状態を再確認（customerタイプのみ）
watch(() => useRoute().path, async () => {
  if (props.userType === 'customer') {
    isAuthenticated.value = await checkAuth()
    if (isAuthenticated.value) {
      currentUser.value = await getUser()
    } else {
      currentUser.value = null
    }
  }
})
</script>