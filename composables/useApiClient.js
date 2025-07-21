/**
 * 統一的 API 客戶端管理
 * 提供統一的 API 請求介面，避免重複的 baseURL 和認證邏輯
 */
export const useApiClient = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL
  const token = useCookie('HotelToken')

  /**
   * 獲取當前 auth 配置（每次調用都是最新的）
   */
  const getAuthConfig = () => ({
    baseURL,
    headers: {
      Authorization: token.value || ''
    }
  })

  /**
   * 不需要認證的 API 請求
   * @param {string} url - API 端點
   * @param {object} options - fetch 選項
   * @returns {Promise} API 回應
   */
  const fetchApi = (url, options = {}) => {
    return $fetch(url, {
      baseURL,
      ...options
    })
  }

  /**
   * 需要認證的 API 請求
   * @param {string} url - API 端點  
   * @param {object} options - fetch 選項
   * @returns {Promise} API 回應
   */
  const fetchApiWithToken = (url, options = {}) => {
    return $fetch(url, {
      baseURL,
      headers: {
        Authorization: token.value || '',
        ...options.headers
      },
      ...options
    })
  }

  return {
    fetchApi,
    fetchApiWithToken,
    getAuthConfig,
    // 便利屬性，直接取得當前 auth 配置
    get auth() {
      return getAuthConfig()
    }
  }
} 