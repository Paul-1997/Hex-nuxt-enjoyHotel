/**
 * 格式化日期
 * @param {string | number | Date} date - 要格式化的日期
 * @param {string} format - 日期格式 (預設: YYYY/MM/DD)
 * @returns {string} 格式化後的日期字串
 */
export const formatDate = (date, format = 'YYYY/MM/DD') => {
  if (!date) return '--'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '--'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
} 