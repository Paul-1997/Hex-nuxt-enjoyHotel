export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkLogin } = useUserStore()
  try {
    await checkLogin()
  } catch (error) {
    // 重新登入
    if (error.response?.status === 403) {
      const { isConfirmed } = await errorAlert('登入失敗', error.response?._data?.message, {
        showCancelButton: true,
        cancelButtonText: '稍後再說',
        confirmButtonText: '立即登入'
      })
      // 如果使用者選擇了確認，則導向登入頁面
      if (isConfirmed) { navigateTo('/account/login') }
    } 
    else { errorAlert() }
  }
})
