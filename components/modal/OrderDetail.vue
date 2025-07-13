<template>
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
              :value="orderId"
              disabled
            >
          </div>
          <!-- 訂單狀態 -->
          <div>
            <label class="form-label">入住狀態</label>
            <select
              v-model="orderData.status"
              class="form-select"
              :disabled="!isEditing"
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
            <input
              type="text"
              class="form-control"
              :disabled="!isEditing"
              :value="orderData?.roomId?.name"
              name="roomId.name"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">入住人數</label>
            <input
              type="number"
              class="form-control"
              :disabled="!isEditing"
              :value="orderData?.peopleNum"
              name="peopleNum"
              min="1"
            >
          </div>

          <!-- 日期選擇 -->
          <div class="col-md-6">
            <label class="form-label">入住日期</label>
            <input
              type="date"
              class="form-control"
              :disabled="!isEditing"
              :value="formatDate(orderData?.checkInDate)"
              name="checkInDate"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">退房日期</label>
            <input
              type="date"
              class="form-control"
              :disabled="!isEditing"
              :value="formatDate(orderData?.checkOutDate)"
              name="checkOutDate"
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
                  type="text"
                  class="form-control"
                  :value="orderData?.userInfo?.name"
                  disabled
                >
              </div>
              <div class="">
                <label class="form-label">聯絡電話</label>
                <input
                  type="tel"
                  class="form-control"
                  :value="orderData?.userInfo?.phone"
                  disabled
                >
              </div>
              <div class="">
                <label class="form-label">電子郵件</label>
                <input
                  type="email"
                  class="form-control"
                  :disabled="!isEditing"
                  :value="orderData?.userInfo?.email"
                  name="userInfo.email"
                >
              </div>
              <div class="col-12">
                <label class="form-label">地址</label>
                <input
                  type="text"
                  class="form-control"
                  :value="formattedAddress"
                  disabled
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
                  <span>NT$ {{ orderData?.roomId?.price }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span>入住天數：</span>
                  <span>{{ calculateDayDiffs(orderData) }} 天</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span>折扣：</span>
                  <span>10%</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">總金額：</span>
                  <span class="fw-bold">
                    NT$ {{ calculateTotalPrice(orderData) }}
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

<script setup>
import zipcode from '~/assets/zipcode'

// 使用 props 接收 orderId
const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update'])

const orderData = ref({});

// 透過orderId去取得該訂單資料
watchEffect(async()=> {
  if (!props.orderId) return
  
  const { data } = await useFetch(`/orders/${props.orderId}`,{
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
      Authorization: useCookie('HotelToken').value || ''
    }
  })
  orderData.value = data.value?.result || {};
})

// 表單編輯狀態
const isEditing = ref(false)

// 計算完整地址
const formattedAddress = computed(() => {
  if (!orderData.value?.userInfo?.address) return '';
  
  const { zipcode: zip, detail } = orderData.value.userInfo.address;
  if (!zip || !detail) return '';

  // 遍歷所有縣市
  for (const city in zipcode) {
    // 遍歷該縣市的所有城鎮
    for (const district in zipcode[city]) {
      // 如果找到對應的郵遞區號
      if (+zipcode[city][district] === zip) {
        return `${city}${district}${detail}`;
      }
    }
  }
  
  return '';
})

const calculateDayDiffs = ({checkInDate, checkOutDate}) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const calculateTotalPrice = (order) => {
  const days = calculateDayDiffs(order);
  return Math.round(days * order.roomId.price * 0.9);
}

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

// 更新訂單資料
const updateOrder = async () => {
  try {
    const { data } = await $fetch(`/orders/${props.orderId}`, {
      method: 'PATCH',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      },
      body: orderData.value
    })
    
    if (data.value?.success) {
      emit('update', orderData.value)
    }
  } catch (error) {
    console.error('更新訂單失敗：', error)
  }
}
</script>

<style scoped>
.order-detail {
  padding: 1rem;
}

@media (max-width: 767px) {
  .order-detail {
    padding: 0.5rem;
  }
}

/* 確保日期選擇器在行動裝置上的可用性 */
input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
  padding-right: 0.5rem;
}
</style>
