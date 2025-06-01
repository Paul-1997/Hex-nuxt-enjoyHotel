<template>
  <div>
    <h2 class="mb-4">
      訂單管理
    </h2>

    <!-- 搜尋和篩選區 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">訂單編號</label>
            <input
              type="text"
              class="form-control"
              placeholder="搜尋訂單編號"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">客戶名稱</label>
            <input
              type="text"
              class="form-control"
              placeholder="搜尋客戶名稱"
            >
          </div>
          <div class="col-md-3">
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
          <div class="col-md-3">
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
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>客戶名稱</th>
                <th>房型</th>
                <th>入住日期</th>
                <th>退房日期</th>
                <th>金額</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colspan="9"
                  class="text-center"
                >
                  暫無訂單資料
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁 -->
        <nav class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item disabled">
              <a
                class="page-link"
                href="#"
                tabindex="-1"
              >上一頁</a>
            </li>
            <li class="page-item active">
              <a
                class="page-link"
                href="#"
              >1</a>
            </li>
            <li class="page-item disabled">
              <a
                class="page-link"
                href="#"
              >下一頁</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.table th {
  white-space: nowrap;
}
</style> 