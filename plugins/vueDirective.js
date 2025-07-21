import { 
  formatDateChinese, 
  formatDateMobile, 
  formatDateLocale, 
  formatDateTime, 
  formatDateShort 
} from '~/utils/formatDate'

export default defineNuxtPlugin((nuxtApp) => {
  // 價格格式指令
  nuxtApp.vueApp.directive('currency', {
    updated(el, binding) {
      updateCurrencyContent(el, binding);
    },
    mounted(el, binding) {
      updateCurrencyContent(el, binding);
    }
  });
  
  // 日期格式化指令
  nuxtApp.vueApp.directive('formatDate', {
    updated(el, binding) {
      updateDateContent(el, binding);
    },
    mounted(el, binding) {
      updateDateContent(el, binding);
    }
  });
});

// 價格格式化函數
function updateCurrencyContent(el, binding) {
  // 檢查值是否有效
  if (binding.value === undefined || binding.value === null || isNaN(binding.value)) {
    el.textContent = 'NT$ 0';
    return;
  }
  
  // 確保值是數字
  const numericValue = Number(binding.value);
  if (isNaN(numericValue)) {
    el.textContent = 'NT$ 0';
    return;
  }
  
  try {
    const formattedValue = numericValue.toLocaleString('zh-TW', {
      style: 'currency',
      currency: 'TWD',      
      maximumFractionDigits: 0
    });
    const result = `NT ${formattedValue}`;

    el.textContent = binding.modifiers.negative ? `- ${result}` : result;
  } catch (error) {
    console.warn('價格格式化失敗：', error);
    el.textContent = 'NT$ 0';
  }
}

// 日期格式化函數
function updateDateContent(el, binding) {
  if (!binding.value) {
    el.textContent = '';
    return;
  }
  
  try {
    // 根據修飾符決定格式
    if (binding.modifiers.mobile) {
      // v-format-date.mobile="date" → "12 / 25"
      el.textContent = formatDateMobile(binding.value);
    } else if (binding.modifiers.locale) {
      // v-format-date.locale="date" → "2024/12/25"
      el.textContent = formatDateLocale(binding.value);
    } else if (binding.modifiers.datetime) {
      // v-format-date.datetime="date" → "2024/12/25 14:30:25"
      el.textContent = formatDateTime(binding.value);
    } else if (binding.modifiers.short) {
      // v-format-date.short="date" → "12/25"
      el.textContent = formatDateShort(binding.value);
    } else {
      // v-format-date="date" → "12 月 25 日星期 一" (預設)
      el.textContent = formatDateChinese(binding.value);
    }
  } catch (error) {
    console.warn('日期格式化指令失敗：', error);
    el.textContent = '';
  }
}