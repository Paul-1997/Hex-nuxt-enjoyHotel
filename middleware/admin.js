export default defineNuxtRouteMiddleware(async (to) => {
  const { errorAlert } = useAlert();
  const { getUserInfo, checkLogin } = useUserStore();
  const { userInfo ,isAdmin, isLogin } = storeToRefs(useUserStore());
  const router = useRouter();

  // 定義返回登入頁面的函式
  const backToLogin = () => router.push({
      path: '/account/login',
      query: {
        redirectURL: to.fullPath,
        isAdmin: true
      }
    })
  try{
    // no login
    if (!isLogin.value){
      await checkLogin();
      if(!isLogin.value) throw createError({
        statusCode: 403,
        result: false
      });
    }
    // not admin
    if (!isAdmin.value) {
      await getUserInfo();
      if(userInfo.value.role !== 'admin') {
        const option = {
          backdrop: 'rgba(0,0,0,0.7)',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }
        errorAlert('錯誤', '您沒有權限進入管理頁面', option)
        return router.push('/');
      }
  }
  } catch (error) {
    if(!error.result) return backToLogin();
  }

})

