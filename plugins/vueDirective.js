export default defineNuxtPlugin((nuxtApp) => {
  // 價格格式指令
  nuxtApp.vueApp.directive('currency', {
    updated(el, binding) {
      updateTextContent(el, binding);
    },
    mounted(el, binding) {
      updateTextContent(el, binding);
    }
  });
  // 日期轉換格式指令
  nuxtApp.vueApp.directive('formatDate', {

  })
});


function updateTextContent(el,binding){
  const formattedValue = binding.value.toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'TWD',      
    maximumFractionDigits: 0
  });
  const result = `NT ${formattedValue}`;

  el.textContent = binding.modifiers.negative ? `- ${result}` : result;
}