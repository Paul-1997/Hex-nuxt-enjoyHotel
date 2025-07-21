<template>
  <div class="min-vh-100 d-flex admin-layout">
    <!-- 手機版展開按鈕 -->
    <button 
      class="toggle-btn d-md-none align-content-center"
      :class="{ 
        'active': !isSidebarCollapsed,
        'toggle-btn-expanded': !isSidebarCollapsed && isSmallScreen
      }"
      @click="toggleSidebar"
    >
      <Icon
        :icon="isSidebarCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'"
        class="fs-5 text-white"
      />
    </button>

    <!-- 遮罩層 -->
    <div 
      v-if="!isSidebarCollapsed && isSmallScreen"
      class="position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 1040; background-color: rgba(118, 90, 63, 0.3); backdrop-filter: blur(2px);"
      @click="toggleSidebar"
    />

    <!-- 左側面板 -->
    <div 
      class="d-flex flex-column position-fixed h-100 sidebar-panel"
      :class="[
        isSmallScreen ? 'sidebar-mobile' : 'sidebar-desktop',
        { 'sidebar-expanded': !isSidebarCollapsed }
      ]"
      style="z-index: 1050;"
    >
      <!-- 頂部標題區 -->
      <div class="p-4 text-center">
        <h3 class="mb-0 fw-bold text-neutral-0">
          享樂酒店管理系統
        </h3>
      </div>
      
      <hr class="opacity-25 mx-3 border-neutral-0">

      <!-- 導航選單 -->
      <ul class="nav flex-column flex-grow-1 gap-4 p-3">
        <li class="nav-item text-center">
          <NuxtLink
            to="/admin"
            class="nav-link text-neutral-0 rounded p-3 fs-5"
            active-class="active-page"
          >
            <Icon
              icon="mdi:view-dashboard"
              class="me-3 fs-4"
              style="margin-bottom: 6px;"
            />
            <span>總覽</span>
          </NuxtLink>
        </li>
        <li class="nav-item text-center">
          <NuxtLink
            to="/admin/products"
            class="nav-link text-neutral-0 rounded p-3 fs-5"
            active-class="active-page"
          >
            <Icon
              icon="mdi:package-variant"
              class="me-3 fs-4"
              style="margin-bottom: 6px;"
            />
            <span>產品管理</span>
          </NuxtLink>
        </li>
        <li class="nav-item text-center">
          <NuxtLink
            to="/admin/orders"
            class="nav-link text-neutral-0 rounded p-3 fs-5"
            active-class="active-page"
          >
            <Icon
              icon="mdi:cart"
              class="me-3 fs-4"
              style="margin-bottom: 6px;"
            />
            <span>訂單管理</span>
          </NuxtLink>
        </li>
        <li class="nav-item text-center">
          <NuxtLink
            to="/admin/news"
            class="nav-link text-neutral-0 rounded p-3 fs-5"
            active-class="active-page"
          >
            <Icon
              icon="mdi:newspaper"
              class="me-3 fs-4"
              style="margin-bottom: 6px;"
            />
            <span>最新消息管理</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- 底部按鈕區 -->
      <div class="p-3 border-top border-neutral-0 d-flex justify-content-center gap-4">
        <NuxtLink
          to="/"
          class="btn p-3 text-neutral-0 hover-scale"
        >
          <Icon
            icon="mdi:home"
            class="fs-3"
          />
        </NuxtLink>
        <button 
          class="btn text-neutral-0 hover-scale"
          @click="handleLogout"
        >
          <Icon
            icon="mdi:logout"
            class="fs-3"
          />
        </button>
      </div>
    </div>

    <!-- 主要內容區 -->
    <div 
      class="flex-grow-1 p-4 transition-margin bg-primary-10"
      :class="[
        isSmallScreen ? 'ms-0' : (isSidebarCollapsed ? 'ms-0' : 'ms-sidebar')
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
const { userLogout } = useUserStore();
const isSidebarCollapsed = ref(true)
const isSmallScreen = ref(false)

// 切換側邊欄
const toggleSidebar = () => {
  if (isSmallScreen.value) {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
}

// 登出處理
const handleLogout = async () => {
  await userLogout();
}

// 響應式處理
const handleResize = () => {
  const newIsSmallScreen = window.innerWidth < 768
  isSmallScreen.value = newIsSmallScreen
  isSidebarCollapsed.value = newIsSmallScreen
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始檢查
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

</script>

<style scoped>
/* 定義CSS變數 */
.admin-layout {
  --sidebar-width: 320px;
  --sidebar-bgColor: #765a3f;
  --sidebar-hover: #8b6d4c;
}

/* 側邊欄樣式 */
.sidebar-panel {
  background-color: var(--sidebar-bgColor);
}

.sidebar-desktop {
  width: 0;
  transition: all 0.3s ease;
}

.sidebar-desktop.sidebar-expanded {
  width: var(--sidebar-width);
}

.sidebar-mobile {
  width: var(--sidebar-width); 
  transform: translateX(-100%);
  transition: all 0.3s ease;
}

.sidebar-mobile.sidebar-expanded {
  transform: translateX(0);
}

/* 主內容區域位移 */
.ms-sidebar {
  margin-left: var(--sidebar-width);
}

.transition-margin {
  transition: margin-left 0.3s ease;
}

/* 活動頁面樣式 */
.active-page {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid #fff;
}

/* 導航連結hover效果 */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 漢堡按鈕樣式 */
.toggle-btn {
  position: fixed;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 80px;
  background: var(--sidebar-bgColor);
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  border: none;
  padding: 10px 0px;
  z-index: 1060;
  transition: all 0.3s ease;
}

.toggle-btn-expanded {
  left: var(--sidebar-width);
}

.toggle-btn i {
  display: block;
  font-size: 1rem;
  color: #fff;  
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: var(--sidebar-hover);
}

.toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.hover-scale:hover {
  transform: scale(1.1);
}
</style>