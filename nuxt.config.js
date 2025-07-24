// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/styles/all.scss'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: "width=device-width, initial-scale=1",
      title: "享樂旅館 | 高雄頂級旅館 - 提供奢華住宿體驗",
      charset: "utf-8",
      meta: [
        { name: 'description', content: '享樂旅館 - 高雄頂級住宿首選，提供奢華客房、頂級設施與尊榮服務' },
        { name: 'author', content: '享樂旅館 Enjoyment Luxury Hotel' },
        { name: 'copyright', content: '© 2024 享樂旅館. All Rights Reserved.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'keywords', content: '享樂旅館,高雄住宿,豪華旅館,五星級飯店,高級住宿' },
        { property: 'og:title', content: '享樂旅館 | 高雄頂級旅館' },
        { property: 'og:description', content: '享受奢華住宿體驗，擁有精緻客房、完善設施及貼心服務' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://enjoyment-luxury-hotel.vercel.app/' },
        { property: 'og:image', content: '/images/home-banner.jpg' },
        { property: 'og:site_name', content: '享樂旅館' },
        { property: 'og:locale', content: 'zh_TW' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '享樂旅館 | 高雄頂級旅館' },
        { name: 'twitter:description', content: '高雄奢華住宿首選，提供尊榮服務與頂級設施' },
        // 針對不同裝置與瀏覽器的優化設定
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '享樂旅館' },
        { name: 'theme-color', content: '#BF9D7D' },
        { name: 'msapplication-TileColor', content: '#BF9D7D' },
        { name: 'msapplication-navbutton-color', content: '#BF9D7D' },
        // 響應式設計相關
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' }
      ]
    },
  },
  runtimeConfig: {
    public: {
      "baseURL": process.env.APP_BASEURL,
    }
  },
  modules: ['@pinia/nuxt', '@vee-validate/nuxt'],
  // VeeValidate module configuration
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  imports: {
    dirs: ['stores']
  },
});
