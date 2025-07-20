/**
 * 日期格式化工具函數
 * 
 * @example 
 * // 在模板中使用指令
 * <span v-format-date="order.date"></span>                    // → "12 月 25 日星期 一"
 * <span v-format-date.mobile="order.date"></span>            // → "12 / 25"  
 * <span v-format-date.locale="order.date"></span>            // → "2024/12/25"
 * <span v-format-date.datetime="order.date"></span>          // → "2024/12/25 14:30:25"
 * <span v-format-date.short="order.date"></span>             // → "12/25"
 * 
 * @example
 * // 在 JavaScript 中使用函數
 * import { formatDateChinese, formatDateMobile } from '~/utils/formatDate'
 * 
 * const computedDate = computed(() => formatDateChinese(order.value.date))
 * const mobileDate = formatDateMobile(bookingDate.start)
 */

/**
 * 格式化為中文日期格式
 * @param {string|Date} date - 日期
 * @returns {string} "12 月 25 日星期 一" 格式
 */
export const formatDateChinese = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[dateObj.getDay()]
    
    return `${month} 月 ${day} 日星期 ${weekDay}`
  } catch (error) {
    return ''
  }
}

/**
 * 手機版日期格式
 * @param {string} date - 日期字串 (YYYY-MM-DD)
 * @returns {string} "12 / 25" 格式
 */
export const formatDateMobile = (date) => {
  if (!date) return ''
  
  try {
    // 處理字串格式的日期
    if (typeof date === 'string' && date.includes('-')) {
      return date.split('-').slice(1, 3).join(' / ')
    }
    
    // 處理 Date 物件
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = dateObj.getDate().toString().padStart(2, '0')
    return `${month} / ${day}`
  } catch (error) {
    return ''
  }
}

/**
 * 本地日期格式 (管理員用)
 * @param {string|Date} date - 日期
 * @returns {string} "2024/12/25" 格式
 */
export const formatDateLocale = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    
    return dateObj.toLocaleDateString('zh-TW')
  } catch (error) {
    return ''
  }
}

/**
 * 完整的日期時間格式
 * @param {string|Date} date - 日期
 * @returns {string} "2024/12/25 14:30:25" 格式
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    
    const dateStr = dateObj.toLocaleDateString('zh-TW')
    const timeStr = dateObj.toLocaleTimeString('zh-TW')
    return `${dateStr} ${timeStr}`
  } catch (error) {
    return ''
  }
}

/**
 * 簡短的 MM/DD 格式 (儀表板用)
 * @param {string|Date} date - 日期
 * @returns {string} "12/25" 格式
 */
export const formatDateShort = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = dateObj.getDate().toString().padStart(2, '0')
    return `${month}/${day}`
  } catch (error) {
    return ''
  }
} 