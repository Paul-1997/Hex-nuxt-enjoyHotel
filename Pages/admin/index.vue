<template>
  <div>
    <h2 class="mb-4">
      儀表板總覽
    </h2>
    
    <div class="row g-4">
      <!-- 訂單統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <Icon
                icon="mdi:cart"
                class="me-2"
              />
              總訂單數
            </h6>
            <h2 class="card-text mt-3">
              <span v-if="isLoading">-</span>
              <span v-else>{{ dashboardStats.totalOrders?.toLocaleString() || 0 }}</span>
            </h2>
          </div>
        </div>
      </div>

      <!-- 房型統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <Icon
                icon="mdi:home"
                class="me-2"
              />
              房型數量
            </h6>
            <h2 class="card-text mt-3">
              <span v-if="isLoading">-</span>
              <span v-else>{{ dashboardStats.totalRooms?.toLocaleString() || 0 }}</span>
            </h2>
          </div>
        </div>
      </div>

      <!-- 佳餚統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-primary-80 text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <Icon
                icon="mdi:food"
                class="me-2"
              />
              佳餚數量
            </h6>
            <h2 class="card-text mt-3">
              <span v-if="isLoading">-</span>
              <span v-else>{{ dashboardStats.totalCulinary?.toLocaleString() || 0 }}</span>
            </h2>
          </div>
        </div>
      </div>

      <!-- 最新消息統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-neutral-60 text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <Icon
                icon="mdi:newspaper"
                class="me-2"
              />
              最新消息數量
            </h6>
            <h2 class="card-text mt-3">
              <span v-if="isLoading">-</span>
              <span v-else>{{ dashboardStats.totalNews?.toLocaleString() || 0 }}</span>
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近訂單列表 -->
    <div class="card mt-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <Icon
            icon="mdi:clock-outline"
            class="me-2"
          />
          最近訂單
        </h5>
        <NuxtLink
          to="/admin/orders"
          class="btn btn-outline-primary btn-sm"
        >
          <Icon
            icon="mdi:arrow-right"
            class="me-1"
          />
          查看全部
        </NuxtLink>
      </div>
      <div class="card-body">
        <!-- 桌面版表格 -->
        <div class="table-responsive d-none d-md-block">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>客戶資訊</th>
                <th>入住期間</th>
                <th>金額</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="processedRecentOrders?.length">
                <tr
                  v-for="order in processedRecentOrders"
                  :key="order._id"
                >
                  <td>
                    <code class="text-primary">#{{ order.orderUserId?.slice(-8) || 'N/A' }}</code>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-medium">{{ order.userInfo?.name || '未知' }}</span>
                      <small class="text-muted">{{ order.userInfo?.email || '-' }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span>{{ formatOrderDate(order.checkInDate) }} - {{ formatOrderDate(order.checkOutDate) }}</span>
                      <small class="text-muted">{{ order.calculatedNights }}晚</small>
                    </div>
                  </td>
                  <td>
                    <span class="fw-medium text-success">{{ order.displayPrice }}</span>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="getOrderStatusClass(order.status)"
                    >
                      {{ getOrderStatusText(order.status) }}
                    </span>
                  </td>
                </tr>
              </template>
              <tr v-else-if="isLoading">
                <td
                  colspan="5"
                  class="text-center py-4"
                >
                  <div class="d-flex justify-content-center align-items-center">
                    載入中...
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td
                  colspan="5"
                  class="text-center py-5 text-muted"
                >
                  <Icon
                    icon="mdi:inbox"
                    class="fs-1 opacity-50 d-block mb-2"
                  />
                  暫無訂單資料
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 手機版卡片 -->
        <div class="d-md-none">
          <template v-if="processedRecentOrders?.length">
            <div 
              v-for="order in processedRecentOrders" 
              :key="order._id"
              class="border rounded p-3 mb-3 bg-light"
            >
              <div class="row g-2">
                <div class="col-6">
                  <small class="text-muted">訂單編號</small>
                  <div>
                    <code class="text-primary">#{{ order.orderUserId?.slice(-8) || 'N/A' }}</code>
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted">狀態</small>
                  <div>
                    <span
                      class="badge"
                      :class="getOrderStatusClass(order.status)"
                    >
                      {{ getOrderStatusText(order.status) }}
                    </span>
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted">客戶資訊</small>
                  <div class="fw-medium">
                    {{ order.userInfo?.name || '未知' }}
                  </div>
                  <small class="text-muted">{{ order.userInfo?.email || '-' }}</small>
                </div>
                <div class="col-8">
                  <small class="text-muted">入住期間</small>
                  <div>{{ formatOrderDate(order.checkInDate) }} - {{ formatOrderDate(order.checkOutDate) }}</div>
                  <small class="text-muted">{{ order.calculatedNights }}晚</small>
                </div>
                <div class="col-4 text-end">
                  <small class="text-muted">金額</small>
                  <div class="fw-medium text-success">
                    {{ order.displayPrice }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div
            v-else-if="isLoading"
            class="text-center py-4"
          >
            <div class="d-flex justify-content-center align-items-center">
              載入中...
            </div>
          </div>
          <div
            v-else
            class="text-center py-5 text-muted"
          >
            <Icon
              icon="mdi:inbox"
              class="fs-1 opacity-50 d-block mb-2"
            />
            暫無訂單資料
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { formatDate } from '~/utils/formatDate'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// API 設定
const { fetchApiWithToken } = useApiClient()

// 載入狀態
const isLoading = ref(true)
const { showToast } = useAlert()

// 儀表板統計資料
const dashboardStats = ref({
  totalOrders: 0,
  totalRooms: 0,
  totalCulinary: 0,
  totalNews: 0
})

// 最近訂單資料
const recentOrders = ref([])

/**
 * 計算住宿天數
 */
const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * 獲取訂單顯示價格（根據房間價格計算）
 */
const getOrderDisplayPrice = (order) => {
  // 檢查是否有房間價格資訊
  if (order?.roomId?.price && !isNaN(order.roomId.price)) {
    const nights = calculateNights(order.checkInDate, order.checkOutDate)
    if (nights > 0) {
      const price = Number(order.roomId.price) * nights
      return `NT$ ${price.toLocaleString('zh-TW')}`
    }
  }
  
  // 如果沒有足夠資訊計算價格
  return 'NT$ 0'
}

/**
 * 計算並緩存訂單相關資訊（避免重複計算）
 */
const processOrderData = (order) => {
  const nights = calculateNights(order.checkInDate, order.checkOutDate)
  const displayPrice = getOrderDisplayPrice(order)
  
  return {
    ...order,
    calculatedNights: nights,
    displayPrice: displayPrice
  }
}

/**
 * 處理最近訂單資料（添加計算字段）
 */
const processedRecentOrders = computed(() => {
  if (!recentOrders.value?.length) return []
  
  return recentOrders.value.map(order => processOrderData(order))
})

/**
 * 格式化訂單日期
 */
const formatOrderDate = (date) => {
  if (!date) return '-'
  
  try {
    return formatDate(date, 'MM/DD')
  } catch (error) {
    console.warn('日期格式化失敗：', error)
    return '-'
  }
}

/**
 * 獲取儀表板統計資料
 */
const fetchDashboardStats = async () => {
  try {
    // 並行獲取所有統計資料
    const results = await Promise.allSettled([
      fetchApiWithToken('admin/orders'),
      fetchApiWithToken('admin/rooms', { method: 'get' }),
      fetchApiWithToken('admin/culinary', { method: 'get' }),
      fetchApiWithToken('admin/news', { method: 'get' })
    ])

    const [ordersData, roomsData, culinaryData, newsData] = results.map(result => 
      result.status === 'fulfilled' ? result.value : []
    )

    // 更新統計數據
    dashboardStats.value = {
      totalOrders: ordersData?.result?.length || 0,
      totalRooms: roomsData?.result?.length || 0,
      totalCulinary: culinaryData?.result?.length || 0,
      totalNews: newsData?.result?.length || 0
    }

    // 獲取最近5筆訂單
    if (ordersData?.result?.length) {
      recentOrders.value = ordersData.result
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }

  } catch (error) {
    console.error('獲取儀表板資料失敗：', error)
    showToast('獲取儀表板資料失敗', 'error')
    // 保持預設值 0
  } finally {
    isLoading.value = false
  }
}

/**
 * 獲取訂單狀態對應的CSS類別
 */
const getOrderStatusClass = (status) => {
  const statusMap = {
    0: 'bg-warning',     // 待確認
    1: 'bg-primary',     // 已確認  
    2: 'bg-success',     // 已完成
    '-1': 'bg-danger'    // 已取消
  }
  return statusMap[status] || 'bg-secondary'
}

/**
 * 獲取訂單狀態文字
 */
const getOrderStatusText = (status) => {
  const statusMap = {
    0: '待確認',
    1: '已確認',
    2: '已完成',
    '-1': '已取消'
  }
  return statusMap[status] || '未知'
}

// 頁面載入時獲取資料
onMounted(() => {
  fetchDashboardStats()
})
</script>
