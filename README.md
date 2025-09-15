# 🏨 享樂旅館 - 高雄頂級旅館官網
參加 [六角學院 Nuxt3課程](https://www.hexschool.com/courses/nuxt3-training.html) 完成的網站
成品部屬在 [Render](https://hex-nuxt-enjoyhotel.onrender.com)

## 🛠 使用技術

- **Nuxt 3**
- **Vue 3**


- **Bootstrap 5** - CSS 框架
- **Tailwind** (Redo)

### 表單驗證與 UI 組件
- **VeeValidate** - 表單驗證
- **SweetAlert2** - 美觀的彈窗提示
- **Vue Loading Overlay** - 載入動畫
- **Swiper** - 輪播組件
- **V-Calendar** - 日期選擇器

### 開發工具
- **ESLint** - 程式碼品質檢查
- **Prettier** - 程式碼格式化
- **Vite** - 建構工具


## 📁 專案結構

```
Hex-nuxt-enjoyHotel/
├── assets/                 # 靜態資源
│   ├── images/            # 圖片資源
│   └── styles/            # 樣式檔案
├── components/            # Vue 組件
│   ├── modal/            # 模態框組件
│   └── rooms/            # 房間相關組件
├── composables/          # 組合式函數
├── layouts/              # 頁面佈局
├── middleware/           # 路由中間件
├── pages/                # 頁面檔案
│   ├── account/          # 帳戶相關頁面
│   ├── admin/            # 管理後台
│   ├── booking/          # 預訂相關
│   └── rooms/            # 房間展示
├── plugins/              # Nuxt 插件
├── server/               # 服務端程式碼
├── stores/               # Pinia 狀態管理
└── utils/                # 工具函數
```

## 🎯 主要功能

### 用戶端功能
- **首頁展示** - 旅館介紹與特色服務
- **房間瀏覽** - 詳細的房型資訊與圖片展示
- **線上預訂** - 完整的預訂流程
- **會員系統** - 註冊、登入、個人資料管理
- **訂單管理** - 查看預訂歷史與狀態

### 管理後台
- **訂單管理** - 查看與處理客戶預訂
- **房間管理** - 房型資訊維護
- **新聞管理** - 旅館最新消息發布
- **用戶管理** - 會員資料管理