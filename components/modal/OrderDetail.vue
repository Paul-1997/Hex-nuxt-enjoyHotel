<template>
  <div class="order-detail">
    <form @submit.prevent>
      <!-- 編輯模式切換 -->
      <div class="d-flex justify-content-end mb-4">
        <button
          type="button"
          class="btn btn-sm"
          :class="isEditing ? 'btn-danger' : 'btn-primary'"
        >
          {{ isEditing ? '取消編輯' : '編輯訂單' }}
        </button>
        {{ orderId }}
        {{ orderData }}
      </div>

      <!-- 訂單基本資訊 -->
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">訂單編號</label>
          <input
            type="text"
            class="form-control"
            :value="orderId"
            disabled
          >
        </div>
        <div class="col-md-6">
          <label class="form-label">訂單狀態</label>
          <select
            class="form-select"
            :disabled="!isEditing"
            name="status"
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

        <!-- 客戶資訊 -->
        <div class="col-md-6">
          <label class="form-label">客戶姓名</label>
          <input
            type="text"
            class="form-control"
            :disabled="!isEditing"
            :value="orderData?.userInfo?.name"
            name="userInfo.name"
          >
        </div>
        <div class="col-md-6">
          <label class="form-label">聯絡電話</label>
          <input
            type="tel"
            class="form-control"
            :disabled="!isEditing"
            :value="orderData?.userInfo?.phone"
            name="userInfo.phone"
          >
        </div>

        <!-- 訂房資訊 -->
        <div class="col-md-6">
          <label class="form-label">房型</label>
          <input
            v-model="orderData.roomId.name"
            :disabled="!isEditing"
            type="text"
            class="form-control"
          >
        </div>
        <div class="col-md-6">
          <label class="form-label">入住人數</label>
          <input
            v-model="orderData.peopleNum"
            type="number"
            class="form-control"
            :disabled="!isEditing"
            name="peopleNum"
            min="1"
          >
        </div>

        <!-- 日期選擇 -->
        <div class="col-md-6">
          <label class="form-label">入住日期</label>
          <input
            :value="formatDate(orderData.checkInDate)"
            type="date"
            class="form-control"
            :disabled="!isEditing"
            name="checkInDate"
          >
        </div>
        <div class="col-md-6">
          <label class="form-label">退房日期</label>
          <input
            type="date"
            :value="orderData.checkOutDate"
            class="form-control"
            :disabled="!isEditing"
            name="checkOutDate"
          >
        </div>

        <!-- 價格資訊 -->
        <div class="col-12">
          <div class="card bg-light">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <span>房間單價：</span>
                <span>NT$ {{ orderData?.roomId?.price }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <span>入住天數： </span>
                <span>{{ calculateDayDiffs(orderData) }} 天</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <span>折扣：</span>
                <span>10%</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">總金額：</span>
                <span
                  v-currency="calculateDayDiffs(orderData) * orderData.roomId.price * .9"
                  class="fw-bold"
                >NT$ </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div
          v-if="isEditing"
          class="col-12"
        >
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '儲存中...' : '儲存變更' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
// 使用 inject 接收父層提供的資料和方法
const orderId = inject('data');
const UpdateOrderData = inject('setData')

const orderData = ref({});
// 透過orderId去取得該訂單資料
const { data } = await useFetch(`/orders/${orderId.value}`,{
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: useCookie('HotelToken').value || ''
  }
})

watchEffect(async()=> {
  const { data } = await useFetch(`/orders/${orderId.value}`,{
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
      Authorization: useCookie('HotelToken').value || ''
    }
  })
  orderData.value = data.value.result;
})

// 表單編輯狀態
const isEditing = ref(false)
const isSubmitting = ref(false)

const calculateDayDiffs = ({checkInDate,checkOutDate}) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
</script>

<style scoped>
.order-detail {
  padding: 1rem;
}

/* 在行動裝置上調整間距 */
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
