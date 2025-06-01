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
        <button class="btn btn-primary">
          <i class="bi bi-plus-lg me-2" />
          新增房型
        </button>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>房型名稱</th>
              <th>價格</th>
              <th>房間數量</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colspan="5"
                class="text-center"
              >
                暫無房型資料
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
        <button class="btn btn-primary">
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
            <tr>
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

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const activeTab = ref('rooms')
</script>

<style scoped>
.tab-content {
  padding: 1rem 0;
}

.table th {
  white-space: nowrap;
}
</style> 