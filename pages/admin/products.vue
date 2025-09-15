<template>
  <div>
    <h2 class="mb-4">
      產品管理
    </h2>
    <!-- 標籤頁導航 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'rooms' }"
          @click="activeTab = 'rooms'"
        >
          房型管理
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'culinary' }"
          @click="activeTab = 'culinary'"
        >
          佳餚管理
        </button>
      </li>
    </ul>

    <!-- 房型管理內容 -->
    <div
      v-if="activeTab === 'rooms'"
      class="tab-content py-4"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">
          房型列表
        </h4>
        <button 
          type="button"
          class="btn btn-primary"
          @click="openModal('room')"
        >
          新增房型
        </button>
      </div>

      <!-- 改用卡片列表取代表格 -->
      <div class="row g-4">
        <template v-if="roomList?.length">
          <div
            v-for="room in roomList"
            :key="room._id"
            class="col-12"
          >
            <div class="card border-0 bg-light">
              <div class="d-flex flex-column flex-sm-row p-3 gap-3">
                <!-- 圖片區域 -->
                <div class="room-image flex-shrink-0 m-auto m-sm-0">
                  <img
                    :src="room.imageUrl"
                    :alt="room.name"
                    class="w-100 h-100 object-fit-cover"
                  >
                </div>

                <!-- 內容區域 -->
                <div class="flex-grow-1">
                  <h5 class="fw-bold mb-2 text-center text-sm-start">
                    {{ room.name }}
                  </h5>
                  <div class="d-flex flex-column flex-sm-row gap-2 gap-sm-4 text-center text-sm-start">
                    <span class="text-primary fw-bold">價格：NT$ {{ room.price?.toLocaleString() }}</span>
                    <span class="text-secondary">坪數：{{ room.areaInfo }}</span>
                  </div>
                </div>

                <!-- 操作按鈕區域 -->
                <div class="d-flex gap-4 flex-shrink-0 m-auto ms-sm-4">
                  <button
                    class="btn btn-link text-primary p-0"
                    @click="openModal('room', room)"
                  >
                    <Icon
                      icon="mdi:pencil"
                      class="fs-5"
                    />
                  </button>
                  <button
                    class="btn btn-link text-danger p-0"
                    @click="openModal('delete', { id: room._id, name: room.name, type: 'rooms' })"
                  >
                    <Icon
                      icon="mdi:delete"
                      class="fs-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Loading 狀態 -->
        <div
          v-else-if="!roomList"
          class="col-12 text-center py-5"
        >
          載入中...
        </div>

        <!-- 無資料狀態 -->
        <div
          v-else
          class="col-12 text-center py-5"
        >
          暫無房型資料
        </div>
      </div>
    </div>

    <!-- 佳餚管理內容 -->
    <div
      v-if="activeTab === 'culinary'"
      class="tab-content py-4"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">
          佳餚列表
        </h4>
        <button 
          class="btn btn-primary"
          @click="openModal('culinary')"
        >
          新增佳餚
        </button>
      </div>

      <!-- 改用卡片列表取代表格 -->
      <div class="row g-4">
        <template v-if="culinaryList?.length">
          <div
            v-for="item in culinaryList"
            :key="item._id"
            class="col-12"
          >
            <div class="card border-0 bg-light">
              <div class="d-flex flex-column flex-sm-row p-3 gap-3">
                <!-- 圖片區域 -->
                <div class="culinary-image flex-shrink-0 m-auto m-sm-0">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="w-100 h-100 object-fit-cover"
                  >
                </div>

                <!-- 內容區域 -->
                <div class="flex-grow-1">
                  <h5 class="fw-bold mb-2 text-center text-sm-start">
                    {{ item.title }}
                  </h5>
                  <p class="mb-0 text-secondary">
                    {{ item.description }}
                  </p>
                </div>

                <!-- 操作按鈕區域 -->
                <div class="d-flex gap-4 flex-shrink-0 m-auto ms-sm-4">
                  <button
                    class="btn btn-link text-primary p-0"
                    @click="openModal('culinary', item)"
                  >
                    <Icon
                      icon="mdi:pencil"
                      class="fs-5"
                    />
                  </button>
                  <button
                    class="btn btn-link text-danger p-0"
                    @click="openModal('delete', { id: item._id, title: item.title, type: 'culinary' })"
                  >
                    <Icon
                      icon="mdi:delete"
                      class="fs-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Loading 狀態 -->
        <div
          v-else-if="!culinaryList"
          class="col-12 text-center py-5"
        >
          載入中...
        </div>

        <!-- 無資料狀態 -->
        <div
          v-else
          class="col-12 text-center py-5"
        >
          暫無佳餚資料
        </div>
      </div>
    </div>
    <!-- 刪除確認 Modal -->
    <Modal
      ref="deleteModal"
      modal-name="delete-confirm-modal"
    >
      <template #title>
        <div class="modal-header">
          <h5 class="modal-title">
            刪除確認
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            aria-label="Close"
            @click="handleCloseDeleteModal"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body">
          <p>確定要刪除以下{{ currentItem?.type === 'rooms' ? '房型' : '佳餚' }}嗎？此操作無法撤銷。</p>
          <div
            v-if="currentItem"
            class="card"
          >
            <div class="card-body">
              <h6 class="card-title">
                {{ currentItem.type === 'rooms' ? currentItem.name : currentItem.title }}
              </h6>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleCloseDeleteModal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="handleConfirmDelete"
        >
          確定刪除
        </button>
      </template>
    </Modal>

    <!-- 佳餚表單 Modal -->
    <Modal
      ref="culinaryModal"
      modal-name="culinary-form-modal"
    >
      <template #title>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? '編輯佳餚' : '新增佳餚' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            aria-label="Close"
            @click="handleCloseCulinaryModal"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body">
          <div class="row">
            <!-- 左側：圖片預覽 -->
            <div class="col-12 col-md-5">
              <div class="mb-3">
                <img 
                  v-if="tempCulinary.image"
                  :src="tempCulinary.image"
                  alt="佳餚圖片預覽"
                  class="img-fluid rounded border"
                  style="max-width: 200px; width: 100%;"
                >
                <div 
                  v-else
                  class="border rounded d-flex align-items-center justify-content-center text-muted"
                  style="height: 150px; max-width: 200px;"
                >
                  暫無圖片
                </div>
              </div>
            </div>

            <!-- 右側：表單欄位 -->
            <div class="col-12 col-md-7">
              <!-- 圖片網址 -->
              <div class="mb-3">
                <label
                  for="culinaryImage"
                  class="form-label"
                >圖片網址</label>
                <input
                  id="culinaryImage"
                  v-model.trim="tempCulinary.image"
                  type="url"
                  class="form-control"
                  placeholder="請輸入圖片網址"
                >
              </div>

              <!-- ID (僅編輯模式顯示) -->
              <div
                v-if="isEdit"
                class="mb-3"
              >
                <label
                  for="culinaryId"
                  class="form-label"
                >ID</label>
                <input
                  id="culinaryId"
                  :value="tempCulinary._id"
                  type="text"
                  class="form-control"
                  readonly
                  disabled
                >
              </div>

              <!-- 名稱 -->
              <div class="mb-3">
                <label
                  for="culinaryTitle"
                  class="form-label"
                >名稱</label>
                <input
                  id="culinaryTitle"
                  v-model.trim="tempCulinary.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入佳餚名稱"
                  required
                >
              </div>

              <!-- 描述 -->
              <div class="mb-3">
                <label
                  for="culinaryDescription"
                  class="form-label"
                >描述</label>
                <textarea
                  id="culinaryDescription"
                  v-model.trim="tempCulinary.description"
                  class="form-control"
                  rows="3"
                  placeholder="請輸入佳餚描述"
                  required
                />
              </div>

              <!-- 用餐時間 -->
              <div class="mb-3">
                <label
                  for="culinaryDiningTime"
                  class="form-label"
                >用餐時間</label>
                <input
                  id="culinaryDiningTime"
                  v-model.trim="tempCulinary.diningTime"
                  type="text"
                  class="form-control"
                  placeholder="例：SUN-MON 11:00-20:30"
                  required
                >
              </div>

              <!-- 時間資訊 (僅編輯模式顯示) -->
              <div
                v-if="isEdit && tempCulinary.createdAt"
                class="d-flex justify-content-between"
              >
                <p class="text-muted small mb-0">
                  建立時間：<span v-format-date.datetime="tempCulinary.createdAt" />
                </p>
                <p class="text-muted small mb-0">
                  更新時間：<span v-format-date.datetime="tempCulinary.updatedAt" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleCloseCulinaryModal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!isCulinaryFormValid"
          @click="handleSubmitCulinary"
        >
          {{ isEdit ? '更新' : '新增' }}
        </button>
      </template>
    </Modal>

    <!-- 房型表單 Modal -->
    <Modal
      ref="roomModal"
      modal-name="room-form-modal"
    >
      <template #title>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? '編輯房型' : '新增房型' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            aria-label="Close"
            @click="handleCloseRoomModal"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body">
          <!-- 主圖預覽 -->
          <div class="row mb-4">
            <div class="col-12">
              <img 
                v-if="tempRoom.imageUrl"
                :src="tempRoom.imageUrl"
                alt="房型主圖預覽"
                class="img-fluid rounded border"
                style="max-width: 200px; width: 100%;"
              >
              <div 
                v-else
                class="border rounded d-flex align-items-center justify-content-center text-muted"
                style="height: 150px; max-width: 200px;"
              >
                暫無圖片
              </div>
            </div>
          </div>

          <!-- 基本資訊 -->
          <!-- 主圖網址 -->
          <div class="mb-3">
            <label
              for="roomMainImage"
              class="form-label"
            >主圖網址</label>
            <input
              id="roomMainImage"
              v-model.trim="tempRoom.imageUrl"
              type="url"
              class="form-control"
              placeholder="請輸入主圖網址"
              required
            >
          </div>

          <!-- 副圖網址 -->
          <div class="mb-3">
            <label class="form-label">副圖網址</label>
            <div 
              v-for="(imageUrl, index) in tempRoom.imageUrlList" 
              :key="index"
              class="d-flex gap-2 mb-2"
            >
              <input
                v-model="tempRoom.imageUrlList[index]"
                type="url"
                class="form-control"
                :placeholder="`副圖 ${index + 1} 網址`"
              >
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="removeSubImage(index)"
              >
                <Icon icon="mdi:delete" />
              </button>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary ms-2"
              @click="addSubImage"
            >
              <Icon
                icon="mdi:plus"
                class="me-1"
              />
              新增副圖
            </button>
          </div>

          <!-- ID (僅編輯模式顯示) -->
          <div
            v-if="isEdit"
            class="mb-3"
          >
            <label
              for="roomId"
              class="form-label"
            >ID</label>
            <input
              id="roomId"
              :value="tempRoom._id"
              type="text"
              class="form-control"
              readonly
              disabled
            >
          </div>

          <!-- 房型名稱 -->
          <div class="mb-3">
            <label
              for="roomName"
              class="form-label"
            >房型名稱</label>
            <input
              id="roomName"
              v-model.trim="tempRoom.name"
              type="text"
              class="form-control"
              placeholder="請輸入房型名稱"
              required
            >
          </div>

          <!-- 描述 -->
          <div class="mb-3">
            <label
              for="roomDescription"
              class="form-label"
            >描述</label>
            <textarea
              id="roomDescription"
              v-model.trim="tempRoom.description"
              class="form-control"
              rows="3"
              placeholder="請輸入房型描述"
              required
            />
          </div>

          <!-- 基本設施資訊 -->
          <div class="row">
            <div class="col-md-6">
              <!-- 價格 -->
              <div class="mb-3">
                <label
                  for="roomPrice"
                  class="form-label"
                >價格</label>
                <input
                  id="roomPrice"
                  v-model="tempRoom.price"
                  type="number"
                  class="form-control"
                  placeholder="請輸入價格"
                  required
                >
              </div>
            </div>
            <div class="col-md-6">
              <!-- 最大人數 -->
              <div class="mb-3">
                <label
                  for="roomMaxPeople"
                  class="form-label"
                >最大人數</label>
                <input
                  id="roomMaxPeople"
                  v-model="tempRoom.maxPeople"
                  type="number"
                  class="form-control"
                  placeholder="請輸入最大人數"
                  required
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <!-- 坪數 -->
              <div class="mb-3">
                <label
                  for="roomAreaInfo"
                  class="form-label"
                >坪數</label>
                <input
                  id="roomAreaInfo"
                  v-model.trim="tempRoom.areaInfo"
                  type="text"
                  class="form-control"
                  placeholder="請輸入坪數"
                  required
                >
              </div>
            </div>
            <div class="col-md-6">
              <!-- 床型資訊 -->
              <div class="mb-3">
                <label
                  for="roomBedInfo"
                  class="form-label"
                >床型資訊</label>
                <input
                  id="roomBedInfo"
                  v-model.trim="tempRoom.bedInfo"
                  type="text"
                  class="form-control"
                  placeholder="例：一張大床"
                  required
                >
              </div>
            </div>
          </div>

          <!-- 格局設備 Collapse -->
          <div class="accordion mb-3">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#layoutCollapse"
                >
                  <Icon
                    icon="mdi:floor-plan"
                    class="me-2"
                  />
                  格局設備
                </button>
              </h2>
              <div
                id="layoutCollapse"
                class="accordion-collapse collapse"
              >
                <div class="accordion-body">
                  <div class="row">
                    <div 
                      v-for="(layout, index) in tempRoom.layoutInfo" 
                      :key="index"
                      class="col-md-6 mb-2"
                    >
                      <div class="form-check form-switch">
                        <input
                          :id="`layout-${index}`"
                          v-model="layout.isProvide"
                          class="form-check-input"
                          type="checkbox"
                        >
                        <label
                          :for="`layout-${index}`"
                          class="form-check-label"
                        >
                          {{ layout.title }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 房內設施 Collapse -->
          <div class="accordion mb-3">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#facilityCollapse"
                >
                  <Icon
                    icon="mdi:television"
                    class="me-2"
                  />
                  房內設施
                </button>
              </h2>
              <div
                id="facilityCollapse"
                class="accordion-collapse collapse"
              >
                <div class="accordion-body">
                  <div class="row">
                    <div 
                      v-for="(facility, index) in tempRoom.facilityInfo" 
                      :key="index"
                      class="col-md-6 mb-2"
                    >
                      <div class="form-check form-switch">
                        <input
                          :id="`facility-${index}`"
                          v-model="facility.isProvide"
                          class="form-check-input"
                          type="checkbox"
                        >
                        <label
                          :for="`facility-${index}`"
                          class="form-check-label"
                        >
                          {{ facility.title }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 備品提供 Collapse -->
          <div class="accordion mb-3">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#amenityCollapse"
                >
                  <Icon
                    icon="mdi:toilet-paper"
                    class="me-2"
                  />
                  備品提供
                </button>
              </h2>
              <div
                id="amenityCollapse"
                class="accordion-collapse collapse"
              >
                <div class="accordion-body">
                  <div class="row">
                    <div 
                      v-for="(amenity, index) in tempRoom.amenityInfo" 
                      :key="index"
                      class="col-md-6 mb-2"
                    >
                      <div class="form-check form-switch">
                        <input
                          :id="`amenity-${index}`"
                          v-model="amenity.isProvide"
                          class="form-check-input"
                          type="checkbox"
                        >
                        <label
                          :for="`amenity-${index}`"
                          class="form-check-label"
                        >
                          {{ amenity.title }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 時間資訊 (僅編輯模式顯示) -->
          <div
            v-if="isEdit && tempRoom.createdAt"
            class="d-flex justify-content-between"
          >
            <p class="text-muted small mb-0">
              建立時間：<span v-format-date.datetime="tempRoom.createdAt" />
            </p>
            <p class="text-muted small mb-0">
              更新時間：<span v-format-date.datetime="tempRoom.updatedAt" />
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleCloseRoomModal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!isRoomFormValid"
          @click="handleSubmitRoom"
        >
          {{ isEdit ? '更新' : '新增' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

// Page Meta
definePageMeta({
  layout: 'admin'
})

// API 設定
const { fetchApiWithToken, getAuthConfig } = useApiClient()

// Loading 狀態控制
const isLoading = ref(false)
const { $loading } = useNuxtApp()
let loader
watch(isLoading, () => {
  if (isLoading.value) {
    loader = $loading.show({
      opacity: 0.25,
      loader: 'dots',
      width: 64,
      height: 64,
    })
  } else {
    loader?.hide()
  }
})

/**
 * 房型完整選項模板
 * 包含所有可能的格局設備、房內設施、備品提供選項
 * 預設 isProvide 為 false，編輯時根據 API 資料覆蓋
 */
const getDefaultRoomTemplate = () => ({
  name: '',
  description: '',
  imageUrl: '',
  imageUrlList: [],
  areaInfo: '',
  bedInfo: '',
  maxPeople: '',
  price: '',
  status: 1,
  // 格局設備選項
  layoutInfo: [
    { title: '市景', isProvide: false },
    { title: '獨立衛浴', isProvide: false },
    { title: '客廳', isProvide: false },
    { title: '書房', isProvide: false },
    { title: '樓層電梯', isProvide: false }
  ],
  // 房內設施選項
  facilityInfo: [
    { title: '平面電視', isProvide: false },
    { title: '吹風機', isProvide: false },
    { title: '冰箱', isProvide: false },
    { title: '熱水壺', isProvide: false },
    { title: '檯燈', isProvide: false },
    { title: '衣櫃', isProvide: false },
    { title: '除濕機', isProvide: false },
    { title: '浴缸', isProvide: false },
    { title: '書桌', isProvide: false },
    { title: '音響', isProvide: false }
  ],
  // 備品提供選項
  amenityInfo: [
    { title: '衛生紙', isProvide: false },
    { title: '拖鞋', isProvide: false },
    { title: '沐浴用品', isProvide: false },
    { title: '清潔用品', isProvide: false },
    { title: '刮鬍刀', isProvide: false },
    { title: '吊衣架', isProvide: false },
    { title: '浴巾', isProvide: false },
    { title: '刷牙用品', isProvide: false },
    { title: '罐裝水', isProvide: false },
    { title: '梳子', isProvide: false }
  ]
})

// 資料狀態
const activeTab = ref('rooms')
const { showToast } = useAlert()

// API 資料獲取
const { data: culinary, refresh: getCulinary } = await useFetch('admin/culinary', { 
  method: 'get',
  ...getAuthConfig()
})
const culinaryList = computed(() => culinary.value?.result ?? [])

const { data: rooms, refresh: getRoom } = await useFetch('admin/rooms', { 
  method: 'get',
  ...getAuthConfig()
})
const roomList = computed(() => rooms.value?.result ?? [])

// Modal 相關狀態
const deleteModal = ref(null)
const culinaryModal = ref(null)
const roomModal = ref(null)
const currentItem = ref(null)
const isEdit = ref(false)

// 佳餚表單資料
const tempCulinary = ref({
  title: '',
  description: '',
  diningTime: '',
  image: ''
})

// 房型表單資料
const tempRoom = ref(getDefaultRoomTemplate())

// 表單驗證
const isCulinaryFormValid = computed(() => {
  return tempCulinary.value.title &&
         tempCulinary.value.description &&
         tempCulinary.value.diningTime &&
         tempCulinary.value.image
})

const isRoomFormValid = computed(() => {
  return tempRoom.value.name &&
         tempRoom.value.description &&
         tempRoom.value.imageUrl &&
         tempRoom.value.areaInfo &&
         tempRoom.value.bedInfo &&
         tempRoom.value.maxPeople &&
         tempRoom.value.price
})

/**
 * 準備佳餚表單資料
 * @param {Object|null} item - 編輯時的佳餚資料
 */
const prepareCulinaryData = (item) => {
  if (item) {
    // 編輯模式：使用深拷貝複製現有資料
    tempCulinary.value = JSON.parse(JSON.stringify(item))
  } else {
    // 新增模式：重置表單
    tempCulinary.value = {
      title: '',
      description: '',
      diningTime: '',
      image: ''
    }
  }
}

/**
 * 準備房型表單資料
 * @param {Object|null} item - 編輯時的房型資料
 */
const prepareRoomData = (item) => {
  if (item) {
    // 編輯模式：先深拷貝API資料避免side effect
    const itemCopy = JSON.parse(JSON.stringify(item))
    tempRoom.value = getDefaultRoomTemplate()
    
    // 複製基本資訊
    const basicFields = [
      'name', 'description', 'imageUrl', 'imageUrlList',
      'areaInfo', 'bedInfo', 'maxPeople', 'price', 'status',
      '_id', 'createdAt', 'updatedAt'
    ]
    
    basicFields.forEach(field => {
      if (itemCopy[field] !== undefined) {
        tempRoom.value[field] = itemCopy[field]
      }
    })
    
    // 設定選項狀態
    ;['layoutInfo', 'facilityInfo', 'amenityInfo'].forEach(category => {
      if (itemCopy[category]?.length) {
        itemCopy[category].forEach(apiItem => {
          const targetItem = tempRoom.value[category].find(
            templateItem => templateItem.title === apiItem.title
          )
          if (targetItem) {
            targetItem.isProvide = apiItem.isProvide
          }
        })
      }
    })
  } else {
    // 新增模式：使用完整模板
    tempRoom.value = getDefaultRoomTemplate()
  }
}

/**
 * 準備刪除確認資料
 * @param {Object} item - 要刪除的項目資料
 */
const prepareDeleteData = (item) => {
  currentItem.value = item
}

// Modal 相關配置
const MODAL_CONFIGS = {
  delete: {
    ref: deleteModal,
    prepareData: prepareDeleteData
  },
  culinary: {
    ref: culinaryModal,
    prepareData: prepareCulinaryData
  },
  room: {
    ref: roomModal,
    prepareData: prepareRoomData
  }
}

/**
 * 開啟指定的 Modal
 * @param {string} type - Modal 類型 ('delete'|'culinary'|'room')
 * @param {Object|null} item - 編輯/刪除時的資料物件
 */
const openModal = (type, item = null) => {
  const config = MODAL_CONFIGS[type]
  if (!config) return
  
  isEdit.value = !!item
  config.prepareData(item)
  config.ref.value?.openModal()
}

// 刪除 Modal 相關方法
const handleCloseDeleteModal = () => {
  deleteModal.value?.closeModal()
  currentItem.value = null
}

const handleConfirmDelete = async () => {
  try {
    const id = currentItem.value.id;
    const type = currentItem.value.type;
    isLoading.value = true;
    handleCloseDeleteModal()
    await fetchApiWithToken(`admin/${type}/${id}`, { method: 'DELETE' })
    //refresh data
    type === 'rooms' ? 
      await getRoom() 
    : await getCulinary()
    showToast(
      '刪除成功',
      'success',
    )
  } catch (error) {
    showToast(
      '刪除失敗',
      'error',
    )
  } finally {
    isLoading.value = false
  }
}



// 佳餚相關方法
const handleCloseCulinaryModal = () => {
  culinaryModal.value?.closeModal()
  currentItem.value = null
  isEdit.value = false
  // 重置表單資料
  tempCulinary.value = {
    title: '',
    description: '',
    diningTime: '',
    image: ''
  }
}

const handleSubmitCulinary = async () => {
      try {
      isLoading.value = true
      // 準備資料
      const submitData = {...tempCulinary.value}
      const path = isEdit.value ? `admin/culinary/${tempCulinary.value._id}` : 'admin/culinary';
      const method = isEdit.value ? 'PUT' : 'POST';
      handleCloseCulinaryModal()
      // 發送資料
      const res = await fetchApiWithToken(path, {
        method: method,
        body: submitData
      })
      console.log(res);
      showToast(
        `佳餚${method === 'PUT' ? '更新' : '新增'}成功`,
        'success',
      )
    // 重新獲取資料
    await getCulinary()
    
    } catch (error) {
    console.log(error);
    console.error('佳餚操作失敗：', error)
    showToast(
      `佳餚${method === 'PUT' ? '更新' : '新增'}失敗`,
      'error',
    )
    } finally {
    isLoading.value = false
  }
}




// 副圖管理方法
const addSubImage = () => {
  tempRoom.value.imageUrlList.push('')
}

const removeSubImage = (index) => {
  tempRoom.value.imageUrlList.splice(index, 1)
}

// 房型相關方法
const handleCloseRoomModal = () => {
  roomModal.value?.closeModal()
  currentItem.value = null
  isEdit.value = false
  // 重置表單資料
  tempRoom.value = getDefaultRoomTemplate()
}

const handleSubmitRoom = async () => {
  try {
    isLoading.value = true
    // 準備資料
    const submitData = {...tempRoom.value}
    const path = isEdit.value ? `admin/rooms/${tempRoom.value._id}` : 'admin/rooms';
    const method = isEdit.value ? 'PUT' : 'POST';
    handleCloseRoomModal()
    // 發送資料
    const res = await fetchApiWithToken(path, {
      method: method,
      body: submitData
    })
    console.log(res);
    showToast(
      `房型${method === 'PUT' ? '更新' : '新增'}成功`,
      'success',
    )
    // 重新獲取資料
    await getRoom()
    
  } catch (error) {
    console.log(error);
    console.error('房型操作失敗：', error)
    showToast(
      `房型${method === 'PUT' ? '更新' : '新增'}失敗`,
      'error',
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.table th {
  white-space: nowrap;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.culinary-image, .room-image {
  width: 100px;
  height: 100px;
}

@media (min-width: 768px) {
  .culinary-image, .room-image {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 992px) {
  .culinary-image, .room-image {
    width: 200px;
    height: 200px;
  }
}
</style> 