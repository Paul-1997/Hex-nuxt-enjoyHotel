<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        最新消息管理
      </h2>
      <button class="btn btn-primary">
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
              type="text"
              class="form-control"
              placeholder="搜尋消息標題"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">狀態</label>
            <select class="form-select">
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

    <!-- 消息列表 -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 50px">
                  <input
                    type="checkbox"
                    class="form-check-input"
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
              <tr>
                <td
                  colspan="7"
                  class="text-center"
                >
                  暫無消息資料
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

        <!-- 批量操作 -->
        <div class="mt-3">
          <button
            class="btn btn-danger me-2"
            disabled
          >
            <i class="bi bi-trash me-2" />
            刪除所選
          </button>
          <button
            class="btn btn-success me-2"
            disabled
          >
            <i class="bi bi-check-circle me-2" />
            發布所選
          </button>
          <button
            class="btn btn-secondary"
            disabled
          >
            <i class="bi bi-archive me-2" />
            封存所選
          </button>
        </div>
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