<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        最新消息管理
      </h2>
      <button 
        class="btn btn-primary"
        @click="handleOpenAddModal"
      >
        新增消息
      </button>
    </div>

    <!-- 搜尋區 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">標題搜尋</label>
            <input
              v-model="searchForm.keyword"
              type="text"
              class="form-control"
              placeholder="請輸入要搜尋的標題關鍵字"
            >
          </div>
          <div class="col-12">
            <button
              class="btn btn-primary me-2"
              @click="handleSearch"
            >
              <Icon
                icon="mdi:magnify"
                class="me-2"
              />
              搜尋
            </button>
            <button
              class="btn btn-outline-secondary"
              @click="handleReset"
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

    <!-- 消息列表 -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th
                  style="width: 100px"
                  class="text-center"
                >
                  圖片
                </th>
                <th>消息</th>
                <th style="width: 150px">
                  更新時間
                </th>
                <th style="width: 120px">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="displayNewsList.length === 0">
                <td
                  colspan="4"
                  class="text-center"
                >
                  {{ searchForm.keyword ? '沒有符合搜尋條件的消息' : '暫無消息資料' }}
                </td>
              </tr>
              <tr
                v-for="news in displayNewsList"
                v-else
                :key="news._id"
              >
                <td class="text-center">
                  <img
                    :src="news.image"
                    :alt="news.title"
                    class="img-thumbnail"
                    style="width: 80px; height: 80px; object-fit: cover;"
                  >
                </td>
                <td>
                  <h5 class="mb-0 text-truncate news-title">
                    {{ news.title }}
                  </h5>
                  <small class="text-muted d-none d-md-block news-description">{{ news.description }}</small>
                </td>
                <td class="d-none d-sm-table-cell">
                  {{ formatDate(news.updatedAt) }}
                </td>
                <td>
                  <div class="btn-group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      title="編輯"
                      @click="handleOpenEditModal(news)"
                    >
                      <Icon
                        icon="mdi:pencil"
                        class="fs-5"
                      />
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      title="刪除"
                      @click="handleOpenDeleteModal(news)"
                    >
                      <Icon
                        icon="mdi:delete"
                        class="fs-5"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 新增/編輯消息 Modal -->
    <Modal
      ref="newsModal"
      :modal-name="'news-form-modal'"
    >
      <template #title>
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
          {{ isEditing ? '編輯消息' : '新增消息' }}
        </h5>
        <button 
          type="button" 
          class="btn-close" 
          aria-label="Close"
            @click="handleCloseNewsModal"
        />
      </div>
      </template>
      
      <template #body>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">圖片網址</label>
            <input
              v-model="tempNews.image"
              type="url"
              class="form-control"
              placeholder="請輸入圖片網址"
              required
            >
          </div>
          <div
            v-if="tempNews.image"
            class="mb-3"
          >
            <label class="form-label">圖片預覽</label>
            <div class="">
              <img
                :src="tempNews.image"
                :alt="tempNews.title"
                class="img-thumbnail"
                style="max-width: 50%; object-fit: cover;"
                @error="handleImageError"
              >
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">標題</label>
            <input
              v-model="tempNews.title"
              type="text"
              class="form-control"
              placeholder="請輸入消息標題"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label">描述</label>
            <textarea
              v-model="tempNews.description"
              class="form-control"
              rows="4"
              placeholder="請輸入消息描述"
              required
            />
          </div>
          <div
            v-if="isEditing"
            class="d-lg-flex justify-content-between align-items-center text-muted small"
          >
            <p class="mb-1">
              建立時間：{{ formatDateTime(tempNews.createdAt) }}
            </p>
            <p class="mb-0">
              上次更新時間：{{ formatDateTime(tempNews.updatedAt) }}
            </p>
          </div>
        </form>
      </template>
      
      <template #footer>
        <button
          type="button"
          class="btn btn-primary px-4"
          @click="handleSubmit"
        >
          {{ isEditing ? '更新' : '新增' }}
        </button>
        <button
          type="button"
          class="btn btn-secondary px-4"
          @click="handleCloseNewsModal"
        >
          取消
        </button>
      </template>
    </Modal>

    <!-- 刪除確認 Modal -->
    <Modal
      ref="deleteModal"
      :modal-name="'delete-confirm-modal'"
    >
      <template #title>
      <div class="modal-header">
        <h5 class="modal-title">
          刪除消息
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
          <p>確定要刪除以下消息嗎？此操作無法撤銷。</p>
          <div
            v-if="tempNews"
            class="card"
          >
            <div class="card-body">
              <h6 class="card-title">
                {{ tempNews.title }}
              </h6>
              <p class="card-text">
                {{ tempNews.description }}
              </p>
            </div>
          </div>
      </div>
      </template>
      
      <template #footer>
        <button
          type="button"
          class="btn btn-secondary px-4"
          @click="handleCloseDeleteModal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-danger px-4"
          @click="handleConfirmDelete"
        >
          確定刪除
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

/**
 * 頁面設定
 */
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

/**
 * Modal 相關
 */
const newsModal = ref(null);
const deleteModal = ref(null);

// Modal 開關控制
const handleOpenAddModal = () => {
  isEditing.value = false;
  tempNews.value = {
    title: '',
    description: '',
    image: ''
  };
  newsModal.value?.openModal();
};

const handleOpenEditModal = (news) => {
  isEditing.value = true;
  selectedNewsId.value = news._id;
  tempNews.value = JSON.parse(JSON.stringify(news));
  newsModal.value?.openModal();
};

const handleOpenDeleteModal = (news) => {
  selectedNewsId.value = news._id;
  tempNews.value = JSON.parse(JSON.stringify(news));
  deleteModal.value?.openModal();
};

const handleCloseNewsModal = () => {
  newsModal.value?.closeModal();
  isEditing.value = false;
  selectedNewsId.value = null;
};

const handleCloseDeleteModal = () => {
  deleteModal.value?.closeModal();
  selectedNewsId.value = null;
};

/**
 * 狀態管理
 */
const isEditing = ref(false);
const selectedNewsId = ref(null);
const newsList = ref([]);
const isLoading = ref(false);

// 臨時消息物件 (用於 modal 中的雙向綁定)
const tempNews = ref({
  title: '',
  description: '',
  image: ''
});

/**
 * Loading 控制
 */
const { $loading } = useNuxtApp();
let loader;
watch(isLoading, () => {
  if(isLoading.value) {
    loader = $loading.show({
      opacity: 0.25,
      loader: 'dots',
      width: 64,
      height: 64,
    });
  } else {
    loader?.hide();
  }
});

/**
 * 搜尋相關
 */
const searchForm = ref({
  keyword: ''
});
const activeKeyword = ref('');

// 過濾後的消息列表
const displayNewsList = computed(() => {
  if (!activeKeyword.value) return newsList.value;
  
  const keyword = activeKeyword.value.toLowerCase();
  return newsList.value.filter(news => 
    news.title.toLowerCase().includes(keyword)
  );
});

const handleSearch = () => {
  activeKeyword.value = searchForm.value.keyword;
};

const handleReset = () => {
  searchForm.value.keyword = '';
  activeKeyword.value = '';
};

/**
 * API 操作
 */
const { showToast } = useAlert();
const { data, refresh } = await useFetch('admin/news', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: useCookie('HotelToken').value || ''
  }
});

// 更新列表數據
const updateNewsList = async () => {
  await refresh();
newsList.value = data.value?.result || [];
};

// 初始化數據
onMounted(async () => {
  await updateNewsList();
});

// 新增消息
const addNews = async (newsData) => {
  try {
    const { status } = await $fetch('admin/news', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      },
      body: newsData
    });
    if (status) {
      showToast('新增消息成功', 'success');
      await updateNewsList();
    }
  } catch (error) {
    console.error('新增消息失敗：', error);
    showToast('新增消息失敗', 'error');
  }
};

// 更新消息
const updateNews = async (id, newsData) => {
  try {
    const { status } = await $fetch(`admin/news/${id}`, {
      method: 'PUT',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      },
      body: newsData
    });
    
    if (status) {
      showToast('更新消息成功', 'success');
      await updateNewsList();
    } else {
      showToast('更新消息失敗', 'error');
    }
  } catch (error) {
    console.error('更新消息失敗：', error);
    showToast('更新消息失敗', 'error');
  }
};

// 刪除消息
const handleConfirmDelete = async () => {
  try {
    isLoading.value = true;
    const id = selectedNewsId.value;
    handleCloseDeleteModal();
    const { status } = await $fetch(`admin/news/${id}`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: useCookie('HotelToken').value || ''
      }
    });
    if (status) {
      showToast('刪除消息成功', 'success');
      await updateNewsList();
    }
  } catch (error) {
    console.error('刪除失敗：', error);
  } finally {
    isLoading.value = false;
  }
};

// 表單提交處理
const handleSubmit = async () => {
  try {
    const id = selectedNewsId.value;
    handleCloseNewsModal();
    isLoading.value = true;
    id
      ? await updateNews(id, tempNews.value) 
      : await addNews(tempNews.value);
  } catch (error) {
    console.error('提交失敗：', error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * 工具函數
 */
// 處理圖片載入錯誤
const handleImageError = (event) => {
  event.target.src = 'https://fakeimg.pl/300/200/?text=圖片載入失敗';
};

// 日期格式化
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-TW');
};

const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.toLocaleDateString('zh-TW')} ${d.toLocaleTimeString('zh-TW')}`;
};
</script> 

<style scoped>
@media (max-width: 767px) {
  .news-title {
    max-width: 150px;
  }
}

@media (max-width: 575px) {
  .news-title {
    max-width: 100px;
  }
}
</style> 