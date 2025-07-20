/**
 * 住宿相關計算工具函數
 */

/**
 * 計算住宿天數
 * @param {string|Date} checkInDate - 入住日期
 * @param {string|Date} checkOutDate - 退房日期
 * @returns {number} 住宿天數
 */
export const calculateDaysDiff = (checkInDate, checkOutDate) => {
  // 檢查必要參數
  if (!checkInDate || !checkOutDate) return 0

  try {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    // 檢查日期是否有效
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0

    // 計算毫秒差
    const diffTime = checkOut - checkIn

    // 將毫秒差轉換為天數
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return Math.max(0, Math.ceil(diffDays))
  } catch (error) {
    console.warn('計算住宿天數失敗：', error)
    return 0
  }
}

/**
 * 計算基本住宿價格 (房間價格 × 天數)
 * @param {number} roomPrice - 房間單價
 * @param {string|Date} checkInDate - 入住日期
 * @param {string|Date} checkOutDate - 退房日期
 * @returns {number} 基本住宿價格
 */
export const calculateBasicPrice = (roomPrice, checkInDate, checkOutDate) => {
  if (!roomPrice || roomPrice <= 0) return 0
  
  const days = calculateDaysDiff(checkInDate, checkOutDate)
  if (days <= 0) return roomPrice
  
  return roomPrice * days
}

/**
 * 計算9折會員價格
 * @param {Object} order - 訂單資料
 * @returns {number} 9折後的價格
 */
export const calculateDiscountPrice = (order) => {
  if (!order?.roomId?.price) return 0
  
  const basePrice = calculateBasicPrice(order.roomId.price, order.checkInDate, order.checkOutDate)
  return Math.round(basePrice * 0.9)
}

/**
 * 計算固定金額折扣價格 (每晚減1000)
 * @param {Object} order - 訂單資料
 * @param {boolean} isMember - 是否為會員
 * @returns {number} 折扣後的價格
 */
export const calculateFixedDiscountPrice = (order, isMember = false) => {
  if (!isMember || !order?.roomId?.price) {
    return calculateBasicPrice(order?.roomId?.price || 0, order?.checkInDate, order?.checkOutDate)
  }
  
  const nights = calculateDaysDiff(order.checkInDate, order.checkOutDate)
  const roomPrice = order.roomId.price
  const finalPrice = (roomPrice - 1000) * nights
  
  return Math.max(0, finalPrice)
} 