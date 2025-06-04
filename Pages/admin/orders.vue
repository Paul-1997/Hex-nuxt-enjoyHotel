<template>
  <div>
    <h2 class="mb-4">
      訂單管理
    </h2>

    <!-- 搜尋和篩選區 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3 col-6">
            <label class="form-label">訂單編號</label>
            <input
              type="text"
              class="form-control"
              placeholder="搜尋訂單編號"
            >
          </div>
          <div class="col-md-3 col-6">
            <label class="form-label">客戶名稱</label>
            <input
              type="text"
              class="form-control"
              placeholder="搜尋客戶名稱"
            >
          </div>
          <div class="col-md-3 col-6">
            <label class="form-label">訂單狀態</label>
            <select class="form-select">
              <option value="">
                全部
              </option>
              <option value="pending">
                待處理
              </option>
              <option value="confirmed">
                已確認
              </option>
              <option value="completed">
                已完成
              </option>
              <option value="cancelled">
                已取消
              </option>
            </select>
          </div>
          <div class="col-md-3 col-6">
            <label class="form-label">日期範圍</label>
            <input
              type="date"
              class="form-control"
            >
          </div>
          <div class="col-12">
            <button class="btn btn-primary me-2">
              <i class="bi bi-search me-2" />
              搜尋
            </button>
            <button class="btn btn-outline-secondary">
              <i class="bi bi-arrow-counterclockwise me-2" />
              重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 訂單列表 -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <!-- 桌面版表格 -->
          <table class="table d-none d-md-table mb-0">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>客戶名稱</th>
                <th>人數</th>
                <th>房型</th>
                <th>入住日期</th>
                <th>退房日期</th>
                <th>總金額</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr>
                  <td
                    colspan="9"
                    class="text-center py-4"
                  >
                    <div
                      class="spinner-border text-primary"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else-if="!orders.length">
                <tr>
                  <td
                    colspan="9"
                    class="text-center"
                  >
                    暫無訂單資料
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr
                  v-for="order in orders"
                  :key="order._id"
                >
                  <td
                    class="text-truncate"
                    style="max-width: 100px;"
                  >
                    {{ order._id }}
                  </td>
                  <td>{{ order.userInfo.name }}</td>
                  <td>{{ order.peopleNum }} 人</td>
                  <td>{{ order.roomId.name }}</td>
                  <td>{{ formatDate(order.checkInDate) }}</td>
                  <td>{{ formatDate(order.checkOutDate) }}</td>
                  <td>NT$ {{ calculateTotalPrice(order) }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="{
                        'bg-secondary': order.status === -1,
                        'bg-success': order.status === 2,
                        'bg-warning text-dark': order.status === 1,
                        'border border-warning text-warning': order.status === 0
                      }"
                    >
                      {{ order.status === 1 ? '待處理' :
                        order.status === 0 ? '處理中' :
                        order.status === 2 ? '已完成' :
                        order.status === -1 ? '已取消' : '未知狀態' }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn btn-sm btn-outline-primary me-2"
                      @click="handleGetOrderDetail(order._id)"
                    >
                      查看
                    </button>
                    <button 
                      v-if="order.status === 1"
                      class="btn btn-sm btn-success me-2"
                    >
                      確認
                    </button>
                    <button 
                      v-if="[1, 0].includes(order.status)"
                      class="btn btn-sm btn-danger"
                    >
                      取消
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- 手機版卡片列表 -->
          <div class="d-md-none">
            <template v-if="isLoading">
              <div class="text-center py-4">
                <div
                  class="spinner-border text-primary"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </template>
            <template v-else-if="!orders.length">
              <div class="text-center py-4">
                暫無訂單資料
              </div>
            </template>
            <template v-else>
              <div
                v-for="order in orders"
                :key="order._id"
                class="border-bottom p-3"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div
                    class="text-truncate me-2"
                    style="max-width: 150px;"
                  >
                    <small class="text-muted">訂單編號：</small>
                    <span>{{ order._id }}</span>
                  </div>
                  <span
                    class="badge"
                    :class="{
                      'bg-secondary': order.status === -1,
                      'bg-success': order.status === 2,
                      'bg-warning text-dark': order.status === 1,
                      'border border-warning text-warning': order.status === 0
                    }"
                  >
                    {{ order.status === 1 ? '待處理' :
                      order.status === 0 ? '處理中' :
                      order.status === 2 ? '已完成' :
                      order.status === -1 ? '已取消' : '未知狀態' }}
                  </span>
                </div>
                <div class="mb-2">
                  <div class="mb-2">
                    <small class="text-muted">客戶名稱：</small>{{ order.userInfo.name }}
                  </div>
                  <div class="mb-2">
                    <small class="text-muted">房型：</small>{{ order.roomId.name }}
                  </div>
                  <div class="mb-2">
                    <small class="text-muted">人數：</small>{{ order.peopleNum }} 人
                  </div>
                  <div class="mb-2">
                    <small class="text-muted">入住日期：</small>{{ formatDate(order.checkInDate) }}
                  </div>
                  <div class="mb-2">
                    <small class="text-muted">退房日期：</small>{{ formatDate(order.checkOutDate) }}
                  </div>
                  <div class="mb-4">
                    <small class="text-muted">總金額：</small>NT$ {{ calculateTotalPrice(order) }}
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    @click="handleGetOrderDetail(order._id)"
                  >
                    查看
                  </button>
                  <button 
                    v-if="order.status === 1"
                    class="btn btn-sm btn-success"
                  >
                    確認
                  </button>
                  <button 
                    v-if="[1, 0].includes(order.status)"
                    class="btn btn-sm btn-danger"
                  >
                    取消
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <Modal
      ref="orderDetailModal"
      :modal-type="selectedOrderId"
    />
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'admin'
})
// modal
const orderDetailModal = ref(null);
const selectedOrderId = ref(null);
const handleUpdateOrder = (v) => {
  // do something
}

// 提供 orderId 給子元件
provide('data', selectedOrderId);
provide('setData', handleUpdateOrder);

const handleGetOrderDetail = (orderId) => {
  selectedOrderId.value = orderId;
  orderDetailModal.value.openModal();
}

// 狀態常數
const orderStatuses = [
  { value: 'pending', label: '待處理' },
  { value: 'confirmed', label: '已確認' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 搜尋表單
const searchForm = ref({
  orderId: '',
  customerName: '',
  status: '',
  checkInDate: ''
})
const isLoading = computed(() => status.value === 'pending')
// API 呼叫
const { data, status, refresh } = await useFetch('admin/orders/', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: useCookie('HotelToken').value || ''
  }
})

const orders = computed(() => data.value?.result || [])

// 計算總價格（含折扣）
const calculateTotalPrice = (order) => {
  // 計算入住天數
  const checkIn = new Date(order.checkInDate)
  const checkOut = new Date(order.checkOutDate)
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  
  // 計算總價
  const basePrice = order.roomId.price * days
  
  // 套用 10% 折扣
  const discountedPrice = basePrice * 0.9
  
  // 格式化金額
  return Math.round(discountedPrice).toLocaleString()
}
</script>
<style scoped>
.table th {
  white-space: nowrap;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 手機版樣式 */
@media (max-width: 767px) {
  .card-body {
    padding: 0;
  }
  
  .badge {
    font-size: 0.75rem;
  }
}
</style> 