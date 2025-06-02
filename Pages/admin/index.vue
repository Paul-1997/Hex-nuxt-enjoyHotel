<template>
  <div>
    <h2 class="mb-4">
      儀表板總覽
    </h2>
    
    <div class="row g-4">
      <!-- 訂單統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <i class="bi bi-cart me-2" />
              總訂單數
            </h6>
            <h2 class="card-text mt-3">
              0
            </h2>
          </div>
        </div>
      </div>

      <!-- 房型統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <i class="bi bi-house me-2" />
              房型數量
            </h6>
            <h2 class="card-text mt-3">
              0
            </h2>
          </div>
        </div>
      </div>

      <!-- 佳餚統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-info text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <i class="bi bi-cup-hot me-2" />
              佳餚數量
            </h6>
            <h2 class="card-text mt-3">
              0
            </h2>
          </div>
        </div>
      </div>

      <!-- 最新消息統計卡片 -->
      <div class="col-md-6 col-lg-3">
        <div class="card bg-warning text-white h-100">
          <div class="card-body">
            <h6 class="card-title">
              <i class="bi bi-newspaper me-2" />
              最新消息數量
            </h6>
            <h2 class="card-text mt-3">
              0
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近訂單列表 -->
    <div class="card mt-4">
      <div class="card-header">
        <h5 class="card-title mb-0">
          最近訂單
        </h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>客戶名稱</th>
                <th>房型</th>
                <th>入住日期</th>
                <th>金額</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colspan="6"
                  class="text-center"
                >
                  暫無訂單資料
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})
</script> 