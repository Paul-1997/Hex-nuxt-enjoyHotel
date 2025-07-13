<template>
  <div>
    <h2 class="mb-4">
      訂單管理
    </h2>

    <!-- 搜尋和篩選區 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4 col-6">
            <label class="form-label">訂單編號</label>
            <input
              v-model="searchFilters.orderId"
              type="text"
              class="form-control"
              placeholder="搜尋訂單編號"
            >
          </div>
          <div class="col-md-4 col-6">
            <label class="form-label">客戶名稱</label>
            <input
              v-model="searchFilters.customerName"
              type="text"
              class="form-control"
              placeholder="搜尋客戶名稱"
            >
          </div>
          <div class="col-md-4 col-6">
            <label class="form-label">訂單狀態</label>
            <select
              v-model="searchFilters.status"
              class="form-select"
            >
              <option
                value=""
                selected
              >
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
          <div class="col-12">
            <button
              class="btn btn-outline-secondary"
              @click="handleResetSearch"
            >
              <Icon
                icon="mdi:refresh"
                class="me-2"
              />
              重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 訂單列表 -->
    <div
      id="ordersAccordion"
      class="accordion"
    >
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
      
      <template v-else-if="!filteredOrders.length">
        <div class="text-center py-4">
          暫無訂單資料
        </div>
      </template>
      
      <template v-else>
        <div
          v-for="(order, index) in filteredOrders"
          :key="order._id"
          class="accordion-item mb-3"
        >
          <h2
            :id="`heading-${order._id}`"
            class="accordion-header"
          >
            <button
              class="accordion-button"
              :class="{ collapsed: index !== 0 }"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse-${order._id}`"
              :aria-expanded="index === 0 ? 'true' : 'false'"
              :aria-controls="`collapse-${order._id}`"
            >
              <div class="d-flex justify-content-between align-items-center w-100 me-3">
                <div class="d-flex align-items-center">
                  <!-- 時間 badge -->
                  <span class="badge bg-secondary me-3 d-none d-lg-inline">
                    {{ formatDate(order.checkInDate) }} - {{ formatDate(order.checkOutDate) }}
                  </span>
                  <span class="fw-bold me-3">訂單編號：{{ order._id }}</span>
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
              </div>
            </button>
          </h2>
          
          <div
            :id="`collapse-${order._id}`"
            class="accordion-collapse collapse"
            :class="{ show: index === 0 }"
            :aria-labelledby="`heading-${order._id}`"
            data-bs-parent="#ordersAccordion"
          >
            <div class="accordion-body">
              <!-- 訂單資料 -->
              <div class="row mb-4">
                <div class="col-12">
                  <h4 class="fw-bold text-dark mb-3 border-bottom pb-2">
                    <Icon
                      icon="mdi:home"
                      class="me-2"
                    />訂單資料
                  </h4>
                  <div class="row g-3">
                    <div class="d-flex">
                      <span class="text-muted">房型：</span>
                      <span class="fw-medium">{{ order.roomId.name }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">價格：</span>
                      <span class="fw-medium">NT$ {{ order.roomId.price }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">入住時間：</span>
                      <span class="fw-medium">{{ formatDate(order.checkInDate) }} - {{ formatDate(order.checkOutDate) }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">入住天數：</span>
                      <span class="fw-medium">{{ calculateDayDiffs(order) }} 天</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">總金額：</span>
                      <span class="fw-bold text-primary">NT$ {{ calculateTotalPrice(order) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 客戶資訊 -->
              <div class="row mb-4">
                <div class="col-12">
                  <h4 class="fw-bold text-dark mb-3 border-bottom pb-2">
                    <Icon
                      icon="mdi:account"
                      class="me-2"
                    />客戶資訊
                  </h4>
                  <div class="row g-3">
                    <div class="d-flex">
                      <span class="text-muted">客戶姓名：</span>
                      <span class="fw-medium">{{ order.userInfo.name }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">聯絡電話：</span>
                      <span class="fw-medium">{{ order.userInfo.phone }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">電子郵件：</span>
                      <span class="fw-medium">{{ order.userInfo.email }}</span>
                    </div>
                    <div class="d-flex">
                      <span class="text-muted">入住人數：</span>
                      <span class="fw-medium">{{ order.peopleNum }} 人</span>
                    </div>
                    <div
                      v-if="order.userInfo.address"
                      class="col-12"
                    >
                      <div class="d-flex">
                        <span class="text-muted">地址：</span>
                        <span class="fw-medium">{{ formatAddress(order.userInfo.address) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 操作按鈕 -->
              <div class="row">
                <div class="col-12">
                  <div class="d-flex justify-content-end gap-2">
                    <button 
                      class="btn btn-outline-primary"
                      @click="handleToggleModal(editOrderModal, order._id)"
                    >
                      <Icon
                        icon="mdi:pencil"
                        class="me-2"
                      />編輯
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click="handleToggleModal(deleteOrderModal, order._id)"
                    >
                      <Icon
                        icon="mdi:delete"
                        class="me-2"
                      />刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 編輯訂單 Modal -->
    <Modal
      ref="editOrderModal"
      modal-name="editOrderModal"
    >
      <!-- 使用 v-if 控制是否渲染 Modal 內容 -->
      <template #title>
        <div
          v-if="selectedOrderId"
          class="modal-header"
        >
          <h2 class="modal-title">
            訂單詳情
          </h2>
          <button 
            type="button" 
            class="btn-close" 
            aria-label="Close"
            @click="handleToggleModal(editOrderModal)"
          />
        </div>
      </template>
      <template #body>
        <div class="order-detail">
          <form @submit.prevent>
            <!-- 訂單資訊區塊 -->
            <div class="order-info">
              <h4 class="mb-4">
                訂單資訊
              </h4>
              <div class="row g-3">
                <!-- 訂單編號 -->
                <div>
                  <label class="form-label">訂單編號</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="tempOrder._id"
                    disabled
                  >
                </div>
                <!-- 訂單狀態 -->
                <div>
                  <label class="form-label">入住狀態</label>
                  <select
                    v-model="tempOrder.status"
                    class="form-select"
                  >
                    <option value="1">
                      待處理
                    </option>
                    <option value="0">
                      處理中
                    </option>
                    <option value="2">
                      已完成
                    </option>
                    <option value="-1">
                      已取消
                    </option>
                  </select>
                </div>

                <!-- 房型資訊 -->
                <div class="col-md-6">
                  <label class="form-label">房型</label>
                  <select
                    v-model="tempOrder.roomId"
                    class="form-select"
                    :disabled="!roomOptions.length"
                  >
                    <option
                      value=""
                      disabled
                    >
                      請選擇房型
                    </option>
                    <option
                      v-for="room in roomOptions"
                      :key="room._id"
                      :value="room"
                      :selected="tempOrder.roomId._id === room._id"
                    >
                      {{ room.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">入住人數</label>
                  <input
                    v-model="tempOrder.peopleNum"
                    type="number"
                    class="form-control"
                    :max="selectedRoom?.maxPeople || 10"
                    min="1"
                  >
                </div>

                <!-- 日期選擇 -->
                <div class="col-md-6">
                  <label class="form-label">入住日期</label>
                  <input
                    v-model="tempOrder.checkInDate"
                    type="date"
                    class="form-control"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">退房日期</label>
                  <input
                    v-model="tempOrder.checkOutDate"
                    type="date"
                    class="form-control"
                  >
                </div>

                <!-- 訂購人資訊 -->
                <div class="col-12">
                  <h4 class="mb-3 mt-4">
                    訂購人資訊
                  </h4>
                  <hr class="mb-4">
                  <div class="row g-3">
                    <div class="">
                      <label class="form-label">客戶姓名</label>
                      <input
                        v-model="tempOrder.userInfo.name"
                        type="text"
                        class="form-control"
                      >
                    </div>
                    <div class="">
                      <label class="form-label">聯絡電話</label>
                      <input
                        v-model="tempOrder.userInfo.phone"
                        type="tel"
                        class="form-control"
                      >
                    </div>
                    <div class="">
                      <label class="form-label">電子郵件</label>
                      <input
                        v-model="tempOrder.userInfo.email"
                        type="email"
                        class="form-control"
                      >
                    </div>
                    <div class="col-12">
                      <label class="form-label">地址</label>
                      <input
                        type="text"
                        class="form-control"
                        :value="formatAddress(tempOrder?.userInfo?.address)"
                      >
                    </div>
                  </div>
                </div>

                <!-- 價格資訊 -->
                <div class="col-12">
                  <div class="card bg-light mt-4">
                    <div class="card-body">
                      <h5 class="card-title mb-3">
                        價格資訊
                      </h5>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>房間單價：</span>
                        <span>NT$ {{ tempOrder.roomId.price || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <span>入住天數：</span>
                        <span>{{ calculateDayDiffs(tempOrder) }} 天</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <span>折扣：</span>
                        <span>10%</span>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">總金額：</span>
                        <span class="fw-bold">
                          NT$ {{ calculateTotalPrice(tempOrder) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary me-2"
            @click="handleEditOrder"
          >
            確定
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="handleToggleModal(editOrderModal)"
          >
            關閉
          </button>
        </div>
      </template>
    </Modal>
    <!-- 刪除訂單 Modal -->
    <Modal
      ref="deleteOrderModal"
      modal-name="deleteOrderModal"
    >
      <template #title>
        <h5 class="modal-title">
          刪除訂單
        </h5>
      </template>
      <template #body>
        <p>確定要刪除這個訂單嗎？此操作無法撤銷。</p>
      </template>
      <template #footer>
        <button
          class="btn btn-secondary"
          @click="handleToggleModal(deleteOrderModal)"
        >
          取消
        </button>
        <button
          class="btn btn-danger"
          @click="handleDeleteOrder(selectedOrderId)"
        >
          確定刪除
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import zipcode from '~/assets/zipcode'

definePageMeta({
  layout: 'admin'
})

// 用戶狀態反饋
const isLoading = computed(() => status.value === 'pending')
const { showToast } = useAlert()
// modal 相關狀態
const editOrderModal = ref(null);
const deleteOrderModal = ref(null);
const selectedOrderId = ref(null);

// 搜尋篩選器
const searchFilters = ref({
  orderId: '',
  customerName: '',
  status: '',
  dateRange: ''
})

// 房型選項
const roomOptions = ref([])
const selectedRoom = computed(() => {
  return roomOptions.value.find(room => room._id === tempOrder.value.roomId._id)
})


// 重置搜尋
const handleResetSearch = () => {
  searchFilters.value = {
    orderId: '',
    customerName: '',
    status: '',
  }
}

// 篩選後的訂單列表
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchFilters.value.orderId) {
    filtered = filtered.filter(order => 
      order._id.toLowerCase().includes(searchFilters.value.orderId.toLowerCase())
    )
  }

  if (searchFilters.value.customerName) {
    filtered = filtered.filter(order => 
      order.userInfo.name.toLowerCase().includes(searchFilters.value.customerName.toLowerCase())
    )
  }

  if (searchFilters.value.status) {
    const statusMap = {
      'pending': 1,
      'confirmed': 0,
      'completed': 2,
      'cancelled': -1
    }
    filtered = filtered.filter(order => order.status === statusMap[searchFilters.value.status])
  }

  return filtered
})

const handleToggleModal = async (modal, orderId) => {
  const isOpen = selectedOrderId.value !== null;
  if(isOpen){
    modal.closeModal();
    selectedOrderId.value = null;
  }else{
    selectedOrderId.value = orderId;
    modal.openModal();
    if(!roomOptions.value.length && modal === editOrderModal.value){
      fetchRoomOptions();
    }
  }
}

// 取得房型選項
const fetchRoomOptions = async () => {
  try {
    const { data } = await useFetch('admin/rooms', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      }
    })
    roomOptions.value = data.value?.result || []
  } catch (error) {
    console.error('取得房型資料失敗：', error)
    showToast('取得房型資料失敗', 'error')
  }
}

// 計算入住天數
const calculateDayDiffs = (order) => {
  if (!order?.checkInDate || !order?.checkOutDate) return 0
  const checkIn = new Date(order.checkInDate)
  const checkOut = new Date(order.checkOutDate)
  const diffTime = Math.abs(checkOut - checkIn)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 計算總價格（含折扣）
const calculateTotalPrice = (order) => {
  let price = 0;
  const days = calculateDayDiffs(order)
  if(selectedRoom.value && selectedOrderId.value){
    price = selectedRoom.value.price * days
  }else{
    price = order.roomId.price * days
  }
  return Math.round(price * 0.9).toLocaleString()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-TW')
}

// 格式化地址
const formatAddress = (address) => {
  if (!address) return ''
  const { zipcode: zip, detail } = address
  if (!zip || !detail) return detail || ''
  
  // 遍歷所有縣市
  for (const city in zipcode) {
    // 遍歷該縣市的所有城鎮
    for (const district in zipcode[city]) {
      // 如果找到對應的郵遞區號
      if (+zipcode[city][district] === zip) {
        return `${city}${district}${detail}`
      }
    }
  }
  
  // 如果找不到對應的地址，返回原始資料
  return `${zip} ${detail}`
}

// 處理刪除訂單
const handleDeleteOrder = async (orderId) => {
  try {
    handleToggleModal(deleteOrderModal.value)
    await $fetch(`admin/orders/${orderId}`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      }
    })
    showToast('刪除訂單成功', 'success')
  } catch (error) {
    showToast('刪除訂單失敗', 'error')
  }
  finally{
    await refresh()
  }
}

// 編輯訂單
const tempOrder = ref({
  _id: '',
  status: '',
  roomId: '',
  peopleNum: '',
  checkInDate: '',
  checkOutDate: '',
  userInfo: {
    name: '',
    phone: '',
    email: '',
    address: {
      detail: ''
    }
  }
})

watch(selectedOrderId, (newId) => {
  if (newId) {
    const temp = orders.value.find(order => order._id === newId)
    tempOrder.value = JSON.parse(JSON.stringify(temp))
    // 處理date格式
    tempOrder.value.checkInDate = temp.checkInDate.split('T')[0]
    tempOrder.value.checkOutDate = temp.checkOutDate.split('T')[0]
}})

const handleEditOrder = async () => {
  try {
    const id = selectedOrderId.value;
    handleToggleModal(editOrderModal.value)
    await $fetch(`admin/orders/${id}`, {
      method: 'PUT',
      baseURL: useRuntimeConfig().public.baseURL,
      body: tempOrder.value,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      }
    })
    showToast('編輯訂單成功', 'success')
  } catch (error) {
    console.log(error)
    showToast('編輯訂單失敗', 'error')
  }
  finally{
    await refresh()
  }
}

// API 呼叫
const { data, status, refresh } = await useFetch('admin/orders/', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: useCookie('HotelToken').value || ''
  }
})
const orders = computed(() => data.value?.result || [])

</script>

<style scoped>
/* 響應式間距調整 */
@media (max-width: 991px) {
  .accordion-item {
    margin-bottom: 0.75rem !important;
  }
}

@media (max-width: 767px) {
  .accordion-item {
    margin-bottom: 0.5rem !important;
  }
}
</style> 