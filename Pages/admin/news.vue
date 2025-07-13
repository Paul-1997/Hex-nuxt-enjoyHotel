<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        最新消息管理
      </h2>
      <button 
        class="btn btn-primary"
        @click="openAddNewsModal"
      >
        <i class="bi bi-plus-lg me-2" />
        新增消息
      </button>
    </div>

    <!-- 搜尋區 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">標題</label>
            <input
              v-model="searchForm.title"
              type="text"
              class="form-control"
              placeholder="搜尋消息標題"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">狀態</label>
            <select
              v-model="searchForm.status"
              class="form-select"
            >
              <option value="">
                全部
              </option>
              <option value="draft">
                草稿
              </option>
              <option value="published">
                已發布
              </option>
              <option value="archived">
                已封存
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">日期範圍</label>
            <input
              v-model="searchForm.date"
              type="date"
              class="form-control"
            >
          </div>
          <div class="col-12">
            <button
              class="btn btn-primary me-2"
              @click="handleSearch"
            >
              <i class="bi bi-search me-2" />
              搜尋
            </button>
            <button
              class="btn btn-outline-secondary"
              @click="handleReset"
            >
              <i class="bi bi-arrow-counterclockwise me-2" />
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
                <th style="width: 50px">
                  <input
                    v-model="selectAll"
                    type="checkbox"
                    class="form-check-input"
                    @change="handleSelectAll"
                  >
                </th>
                <th>標題</th>
                <th>發布日期</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th>更新時間</th>
                <th style="width: 150px">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="newsList.length === 0">
                <td
                  colspan="7"
                  class="text-center"
                >
                  暫無消息資料
                </td>
              </tr>
              <tr
                v-for="news in newsList"
                v-else
                :key="news._id"
              >
                <td>
                  <input
                    v-model="selectedNews"
                    :value="news._id"
                    type="checkbox"
                    class="form-check-input"
                  >
                </td>
                <td>{{ news.title }}</td>
                <td>{{ formatDate(news.publishDate) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusClass(news.status)"
                  >
                    {{ getStatusText(news.status) }}
                  </span>
                </td>
                <td>{{ formatDate(news.createdAt) }}</td>
                <td>{{ formatDate(news.updatedAt) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="handleEdit(news)"
                  >
                    編輯
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="handleDelete(news._id)"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁 -->
        <nav class="mt-4">
          <ul class="pagination justify-content-center">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 1 }"
            >
              <a
                class="page-link"
                href="#"
                @click="handlePageChange(currentPage - 1)"
              >上一頁</a>
            </li>
            <li class="page-item active">
              <a
                class="page-link"
                href="#"
              >{{ currentPage }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click="handlePageChange(currentPage + 1)"
              >下一頁</a>
            </li>
          </ul>
        </nav>

        <!-- 批量操作 -->
        <div class="mt-3">
          <button
            class="btn btn-danger me-2"
            :disabled="selectedNews.length === 0"
            @click="handleBatchDelete"
          >
            <i class="bi bi-trash me-2" />
            刪除所選
          </button>
          <button
            class="btn btn-success me-2"
            :disabled="selectedNews.length === 0"
            @click="handleBatchPublish"
          >
            <i class="bi bi-check-circle me-2" />
            發布所選
          </button>
          <button
            class="btn btn-secondary"
            :disabled="selectedNews.length === 0"
            @click="handleBatchArchive"
          >
            <i class="bi bi-archive me-2" />
            封存所選
          </button>
        </div>
      </div>
    </div>

    <!-- 新增/編輯消息 Modal -->
    <Modal ref="newsModal">
      <div
        v-if="showNewsModal"
        class="modal-header"
      >
        <h5 class="modal-title">
          {{ isEditing ? '編輯消息' : '新增消息' }}
        </h5>
        <button 
          type="button" 
          class="btn-close" 
          aria-label="Close"
          @click="closeNewsModal"
        />
      </div>
      
      <div
        v-if="showNewsModal"
        class="modal-body"
      >
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">標題</label>
            <input
              v-model="newsForm.title"
              type="text"
              class="form-control"
              placeholder="請輸入消息標題"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label">內容</label>
            <textarea
              v-model="newsForm.content"
              class="form-control"
              rows="5"
              placeholder="請輸入消息內容"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">狀態</label>
            <select
              v-model="newsForm.status"
              class="form-select"
            >
              <option value="draft">
                草稿
              </option>
              <option value="published">
                發布
              </option>
              <option value="archived">
                封存
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">發布日期</label>
            <input
              v-model="newsForm.publishDate"
              type="date"
              class="form-control"
            >
          </div>
        </form>
      </div>
      
      <div
        v-if="showNewsModal"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn btn-primary"
          @click="handleSubmit"
        >
          {{ isEditing ? '更新' : '新增' }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeNewsModal"
        >
          取消
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Modal 相關狀態
const newsModal = ref(null);
const showNewsModal = ref(false);
const isEditing = ref(false);

// 搜尋表單
const searchForm = ref({
  title: '',
  status: '',
  date: ''
});

// 消息表單
const newsForm = ref({
  title: '',
  content: '',
  status: 'draft',
  publishDate: ''
});

// 列表相關
const newsList = ref([]);
const selectedNews = ref([]);
const selectAll = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// 開啟新增消息 Modal
const openAddNewsModal = () => {
  isEditing.value = false;
  newsForm.value = {
    title: '',
    content: '',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0]
  };
  showNewsModal.value = true;
  newsModal.value?.openModal();
};

// 關閉消息 Modal
const closeNewsModal = () => {
  newsModal.value?.closeModal();
  showNewsModal.value = false;
  isEditing.value = false;
};

// 處理表單提交
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // 更新消息
      console.log('更新消息：', newsForm.value);
    } else {
      // 新增消息
      console.log('新增消息：', newsForm.value);
    }
    closeNewsModal();
  } catch (error) {
    console.error('提交失敗：', error);
  }
};

// 處理編輯
const handleEdit = (news) => {
  isEditing.value = true;
  newsForm.value = { ...news };
  showNewsModal.value = true;
  newsModal.value?.openModal();
};

// 處理刪除
const handleDelete = async (id) => {
  if (confirm('確定要刪除這則消息嗎？')) {
    console.log('刪除消息：', id);
  }
};

// 搜尋功能
const handleSearch = () => {
  console.log('搜尋條件：', searchForm.value);
};

// 重置搜尋
const handleReset = () => {
  searchForm.value = {
    title: '',
    status: '',
    date: ''
  };
};

// 批量操作
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedNews.value = newsList.value.map(news => news._id);
  } else {
    selectedNews.value = [];
  }
};

const handleBatchDelete = () => {
  console.log('批量刪除：', selectedNews.value);
};

const handleBatchPublish = () => {
  console.log('批量發布：', selectedNews.value);
};

const handleBatchArchive = () => {
  console.log('批量封存：', selectedNews.value);
};

// 分頁
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 工具函數
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-TW');
};

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-secondary',
    published: 'bg-success',
    archived: 'bg-warning'
  };
  return classes[status] || 'bg-secondary';
};

const getStatusText = (status) => {
  const texts = {
    draft: '草稿',
    published: '已發布',
    archived: '已封存'
  };
  return texts[status] || '未知';
};
</script>

<style scoped>
.table th {
  white-space: nowrap;
}
</style> 