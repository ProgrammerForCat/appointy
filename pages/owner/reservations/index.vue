<template>
  <div>
    <div class="space-y-6">
      <!-- ヘッダー -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">予約管理</h1>
          <div class="flex space-x-4">
            <!-- フィルター -->
            <select
              v-model="statusFilter"
              @change="loadReservations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのステータス</option>
              <option value="pending">承認待ち</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>
            
            <!-- 日付フィルター -->
            <input
              v-model="dateFilter"
              @change="loadReservations"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
        
        <!-- 統計情報 -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div 
            @click="toggleStat('today')"
            :class="{'ring-2 ring-blue-500': selectedStat === 'today'}"
            class="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-blue-600 text-sm font-medium">今日の予約</div>
                <div class="text-2xl font-bold text-blue-900">{{ todayCount }}</div>
              </div>
              <svg 
                v-if="selectedStat === 'today'"
                class="w-5 h-5 text-blue-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div 
            @click="toggleStat('pending')"
            :class="{'ring-2 ring-orange-500': selectedStat === 'pending'}"
            class="bg-orange-50 p-4 rounded-lg cursor-pointer hover:bg-orange-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-orange-600 text-sm font-medium">承認待ち</div>
                <div class="text-2xl font-bold text-orange-900">{{ pendingCount }}</div>
              </div>
              <svg 
                v-if="selectedStat === 'pending'"
                class="w-5 h-5 text-orange-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div 
            @click="toggleStat('confirmed')"
            :class="{'ring-2 ring-green-500': selectedStat === 'confirmed'}"
            class="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-green-600 text-sm font-medium">確定予約</div>
                <div class="text-2xl font-bold text-green-900">{{ confirmedCount }}</div>
              </div>
              <svg 
                v-if="selectedStat === 'confirmed'"
                class="w-5 h-5 text-green-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div 
            @click="toggleStat('cancelled')"
            :class="{'ring-2 ring-red-500': selectedStat === 'cancelled'}"
            class="bg-red-50 p-4 rounded-lg cursor-pointer hover:bg-red-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-red-600 text-sm font-medium">キャンセル</div>
                <div class="text-2xl font-bold text-red-900">{{ cancelledCount }}</div>
              </div>
              <svg 
                v-if="selectedStat === 'cancelled'"
                class="w-5 h-5 text-red-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div 
            @click="toggleStat('total')"
            :class="{'ring-2 ring-purple-500': selectedStat === 'total'}"
            class="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-purple-600 text-sm font-medium">総予約数</div>
                <div class="text-2xl font-bold text-purple-900">{{ totalCount }}</div>
              </div>
              <svg 
                v-if="selectedStat === 'total'"
                class="w-5 h-5 text-purple-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
      </div>

      <!-- 予約一覧 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">
              予約一覧
              <span v-if="selectedStat" class="text-sm text-gray-500 ml-2">
                (フィルター: {{ getStatTitle(selectedStat) }})
              </span>
            </h2>
            <button
              v-if="selectedStat"
              @click="clearStatFilter"
              class="text-sm text-blue-600 hover:text-blue-900"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
        
        <div v-if="displayedReservations.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="reservation in displayedReservations"
            :key="reservation.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ reservation.customerName }}</h3>
                  <span
                    :class="getStatusClass(reservation.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
                <div class="mt-2 space-y-1">
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📧 {{ reservation.customerEmail }}</span>
                    <span>📅 {{ formatDate(reservation.startTime) }}</span>
                    <span>🕐 {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <span>🔧 {{ reservation.serviceName }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewReservation(reservation)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  詳細
                </button>
                <button
                  v-if="reservation.status === 'pending'"
                  @click="confirmReservation(reservation)"
                  class="text-green-600 hover:text-green-900"
                >
                  承認
                </button>
                <button
                  v-if="reservation.status === 'pending'"
                  @click="rejectReservation(reservation)"
                  class="text-red-600 hover:text-red-900"
                >
                  拒否
                </button>
                <button
                  v-if="reservation.status === 'confirmed'"
                  @click="cancelReservation(reservation)"
                  class="text-red-600 hover:text-red-900"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="p-6 text-center text-gray-500">
          予約がありません。
        </div>
      </div>
    </div>

    <!-- 詳細モーダル -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">予約詳細</h3>
          
          <div v-if="selectedReservation" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">顧客名</label>
              <p class="text-gray-900">{{ selectedReservation.customerName }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">メールアドレス</label>
              <p class="text-gray-900">{{ selectedReservation.customerEmail }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">サービス</label>
              <p class="text-gray-900">{{ selectedReservation.serviceName }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">日時</label>
              <p class="text-gray-900">
                {{ formatDate(selectedReservation.startTime) }} 
                {{ formatTime(selectedReservation.startTime) }} - {{ formatTime(selectedReservation.endTime) }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">ステータス</label>
              <span :class="getStatusClass(selectedReservation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusText(selectedReservation.status) }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">作成日時</label>
              <p class="text-gray-900">{{ formatDateTime(selectedReservation.createdAt) }}</p>
            </div>
            
            <!-- チャット機能 -->
            <div v-if="selectedReservation">
              <label class="block text-sm font-medium text-gray-700 mb-2">メッセージ</label>
              <div class="border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
                <div v-if="messages.length === 0" class="text-gray-500 text-sm text-center">
                  メッセージはありません
                </div>
                <div v-else class="space-y-2">
                  <div 
                    v-for="message in messages" 
                    :key="message.id"
                    :class="message.senderType === 'owner' ? 'text-right' : 'text-left'"
                    class="pb-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div 
                      :class="message.senderType === 'owner' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'"
                      class="inline-block px-3 py-2 rounded-lg max-w-xs"
                    >
                      <p class="text-sm">{{ message.message }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ message.senderName }} - {{ formatDateTime(message.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- メッセージ送信 -->
              <div class="mt-2 flex space-x-2">
                <input
                  v-model="newMessage"
                  @keypress.enter="sendMessage"
                  type="text"
                  placeholder="メッセージを入力..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 pt-6">
            <button
              v-if="selectedReservation?.status === 'pending'"
              @click="confirmReservation(selectedReservation)"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
            >
              承認
            </button>
            <button
              v-if="selectedReservation?.status === 'pending'"
              @click="rejectReservation(selectedReservation)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              拒否
            </button>
            <button
              v-if="selectedReservation?.status === 'confirmed'"
              @click="cancelReservation(selectedReservation)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              キャンセル
            </button>
            <button
              @click="closeDetailModal"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 認証チェック
definePageMeta({
  middleware: 'auth-owner',
  layout: 'owner'
})

// データの定義
const reservations = ref([])
const showDetailModal = ref(false)
const selectedReservation = ref(null)
const statusFilter = ref('')
const dateFilter = ref('')
const selectedStat = ref('') // 選択されている統計フィルター
const monthFilter = ref('') // 月間フィルター用

// チャット機能
const messages = ref([])
const newMessage = ref('')

// 統計情報の計算
const todayCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservations.value.filter(r => r.startTime.startsWith(today) && r.status === 'confirmed').length
})

const pendingCount = computed(() => {
  return reservations.value.filter(r => r.status === 'pending').length
})

const confirmedCount = computed(() => {
  return reservations.value.filter(r => r.status === 'confirmed').length
})

const cancelledCount = computed(() => {
  return reservations.value.filter(r => r.status === 'cancelled').length
})

const totalCount = computed(() => {
  return reservations.value.length
})

// ステータスのスタイル
const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-800'
    case 'confirmed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '承認待ち'
    case 'confirmed': return '確定'
    case 'cancelled': return 'キャンセル'
    default: return '不明'
  }
}

// 日時フォーマット
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  })
}

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString('ja-JP')
}

// 予約詳細表示
const viewReservation = async (reservation) => {
  selectedReservation.value = reservation
  showDetailModal.value = true
  await loadMessages(reservation.id)
}

// 詳細モーダル閉じる
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedReservation.value = null
  messages.value = []
  newMessage.value = ''
}

// 予約キャンセル
const cancelReservation = async (reservation) => {
  if (!confirm(`${reservation.customerName}様の予約をキャンセルしますか？`)) return
  
  try {
    await $fetch(`/api/owner/reservations/${reservation.id}`, {
      method: 'DELETE'
    })
    closeDetailModal()
    await loadReservations()
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// 予約承認
const confirmReservation = async (reservation) => {
  const customerName = reservation.customerName || reservation.customerEmail || 'お客様'
  if (!confirm(`${customerName}様の予約を承認しますか？`)) return
  
  try {
    await $fetch(`/api/owner/reservations/${reservation.id}/confirm`, {
      method: 'PUT'
    })
    closeDetailModal()
    await loadReservations()
    alert('予約を承認しました')
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// 予約拒否
const rejectReservation = async (reservation) => {
  const reason = prompt('拒否理由を入力してください（省略可）:')
  if (reason === null) return // キャンセル
  
  try {
    await $fetch(`/api/owner/reservations/${reservation.id}/reject`, {
      method: 'PUT',
      body: { reason: reason || '店舗都合によりキャンセル' }
    })
    closeDetailModal()
    await loadReservations()
    alert('予約を拒否しました')
  } catch (err) {
    alert('エラーが発生しました')
  }
}

// チャット機能
const loadMessages = async (reservationId) => {
  try {
    const response = await $fetch(`/api/reservations/${reservationId}/messages`)
    messages.value = response.messages
  } catch (err) {
    console.error('メッセージ取得エラー:', err)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedReservation.value) return
  
  try {
    const response = await $fetch(`/api/reservations/${selectedReservation.value.id}/messages`, {
      method: 'POST',
      body: { message: newMessage.value }
    })
    messages.value.push(response)
    newMessage.value = ''
  } catch (err) {
    alert('メッセージ送信エラー')
  }
}

// フィルタークリア
const clearFilters = () => {
  statusFilter.value = ''
  dateFilter.value = ''
  selectedStat.value = ''
  monthFilter.value = ''
  loadReservations()
}

// 予約一覧取得
const loadReservations = async () => {
  try {
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await $fetch(`/api/owner/reservations${query}`)
    reservations.value = response.reservations
  } catch (err) {
    console.error('予約取得エラー:', err)
  }
}

// 統計カードのトグル
const toggleStat = (stat) => {
  selectedStat.value = selectedStat.value === stat ? '' : stat
  statusFilter.value = ''
  dateFilter.value = ''
}

// 統計タイトル取得
const getStatTitle = (stat) => {
  switch (stat) {
    case 'today': return '今日の予約'
    case 'pending': return '承認待ち'
    case 'confirmed': return '確定予約'
    case 'cancelled': return 'キャンセル済み'
    case 'total': return '全予約'
    case 'monthly': return `${monthFilter.value}の予約`
    default: return ''
  }
}

// 表示する予約リスト
const displayedReservations = computed(() => {
  let filtered = reservations.value
  
  // 統計フィルター
  if (selectedStat.value) {
    const today = new Date().toISOString().split('T')[0]
    
    switch (selectedStat.value) {
      case 'today':
        filtered = filtered.filter(r => 
          r.startTime.startsWith(today) && r.status === 'confirmed'
        )
        break
      case 'pending':
        filtered = filtered.filter(r => r.status === 'pending')
        break
      case 'confirmed':
        filtered = filtered.filter(r => r.status === 'confirmed')
        break
      case 'cancelled':
        filtered = filtered.filter(r => r.status === 'cancelled')
        break
      case 'total':
        // 全件表示のためフィルタリングしない
        break
      case 'monthly':
        if (monthFilter.value) {
          filtered = filtered.filter(r => r.startTime.startsWith(monthFilter.value))
        }
        break
    }
  }
  
  // 通常のフィルター
  if (statusFilter.value) {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }
  
  if (dateFilter.value) {
    filtered = filtered.filter(r => r.startTime.startsWith(dateFilter.value))
  }
  
  return filtered
})

// 統計フィルターをクリア
const clearStatFilter = () => {
  selectedStat.value = ''
  monthFilter.value = ''
}

// URLパラメータからフィルターを設定
const setFilterFromQuery = () => {
  const route = useRoute()
  const filter = route.query.filter
  const month = route.query.month
  
  if (filter === 'today') {
    selectedStat.value = 'today'
  } else if (filter === 'monthly' && month) {
    selectedStat.value = 'monthly'
    monthFilter.value = month
  }
}

// 初期データの取得
onMounted(() => {
  setFilterFromQuery()
  loadReservations()
})

// ルートの変更を監視
watch(() => useRoute().query, () => {
  setFilterFromQuery()
}, { deep: true })
</script>