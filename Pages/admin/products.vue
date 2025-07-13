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
      class="tab-content"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">
          房型列表
        </h4>
        <NuxtLink 
          to="/admin/rooms/new"
          class="btn btn-primary"
        >
          <i class="bi bi-plus-lg me-2" />
          新增房型
        </NuxtLink>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>房型名稱</th>
              <th>價格</th>
              <th>坪數</th>
              <th>最大人數</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!onFetchDataLoading && roomList?.length">
              <tr
                v-for="room in roomList"
                :key="room._id"
              >
                <td>{{ room.name }}</td>
                <td>{{ room.price }}</td>
                <td>{{ room.areaInfo }}</td>
                <td>{{ room.maxPeople }}</td>
                <td>
                  <div class="btn-group">
                    <NuxtLink
                      :to="`/admin/rooms/${room._id}`"
                      class="btn btn-sm btn-outline-primary"
                    >
                      編輯
                    </NuxtLink>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="handleDelete(room.name, room._id, 'rooms')"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else-if="onFetchDataLoading">
              <td
                colspan="5"
                class="text-center"
              >
                <div
                  class="spinner-border text-primary"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td
                colspan="5"
                class="text-center"
              >
                暫無房型資料
              </td>
              <td colspan="5">
                {{ rooms }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 佳餚管理內容 -->
    <div
      v-if="activeTab === 'culinary'"
      class="tab-content"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">
          佳餚列表
        </h4>
        <button 
          class="btn btn-primary"
          @click="openModal(type)"
        >
          <i class="bi bi-plus-lg me-2" />
          新增佳餚
        </button>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>佳餚名稱</th>
              <th>價格</th>
              <th>類型</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!onFetchDataLoading && culinaryList?.length">
              <tr
                v-for="item in culinaryList"
                :key="item._id"
              >
                <td>{{ item.title }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="item.status"
                      @change="handleStatusToggle(item, 'culinary')"
                    >
                  </div>
                </td>
                <td>
                  <div class="btn-group">
                    <NuxtLink
                      :to="`/admin/culinary/${item._id}`"
                      class="btn btn-sm btn-outline-primary"
                    >
                      編輯
                    </NuxtLink>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="handleDelete(item.title, item._id, 'culinary')"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else-if="onFetchDataLoading">
              <td
                colspan="5"
                class="text-center"
              >
                <div
                  class="spinner-border text-primary"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td
                colspan="5"
                class="text-center"
              >
                暫無佳餚資料
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const auth = {
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      }
    }
// 取得佳餚資料
const { data:culinary,status:getCulinaryStatus, refresh:getCulinary } = await useFetch('admin/culinary',{method:'get',...auth})
const culinaryList = computed(()=> culinary.value?.result ?? []);
// 取得房型資料
const { data:rooms,status:getRoomStatus, refresh:getRoom } = await useFetch('admin/rooms',{method:'get',...auth})
const roomList = computed(()=> rooms.value?.result ?? []);

// 狀態管理
const activeTab = ref('rooms')
const onFetchDataLoading = computed(()=> getCulinaryStatus.value === 'pending' || getRoomStatus.value === 'pending');
const onHandleProgress = ref(false);

// 監聽標籤頁切換
watch(activeTab,async (newTab) => newTab === 'rooms' ? await getRoom() : await getCulinary())

// 處理狀態切換
const handleStatusToggle = async (item, type) => {
  try {
    const endpoint = type === 'rooms' ? 'admin/rooms' : 'admin/culinary'
    const { data } = await useFetch(`${endpoint}/${item._id}`, {
      method: 'PATCH',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      },
      body: {
        status: !item.status
      }
    })
    
    if (data.value?.success) {
      if (type === 'rooms') {
        await fetchRooms()
      } else {
        await fetchCulinary()
      }
    }
  } catch (error) {
    console.error('更新狀態失敗：', error)
  }
}

const openUpdateModal = (type,isNew) => {

}
// 刪除項目
const { showDeleteModal } = useAlert()
const handleDelete = async (title, id, type) => {
  const isConfirmed = await showDeleteModal(title)
  if (isConfirmed) {
    try {
      // onHandleProgress.value = true;
      await $fetch(`admin/${type}/${id}`, { method: 'DELETE', ...auth })
      // refresh data
      type === 'rooms' ? await getRoom() : await getCulinary()
    } catch (error) {
      console.error('刪除失敗：', error)
    } finally {
      // onHandleProgress.value = false;
    }
  }
}
</script>

<style scoped>
.tab-content {
  padding: 1rem 0;
}

.table th {
  white-space: nowrap;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style> 