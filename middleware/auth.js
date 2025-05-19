export default defineNuxtRouteMiddleware(async (from) => { 
  const { checkLogin } = useUserStore();
  const { isLogin } = storeToRefs(useUserStore());
  const router = useRouter();
  try {
    if (!isLogin.value) {
      await checkLogin();
    }
  } catch (error) {
    // 確保重定向到登入頁面
    if(error.response?.status){
      return router.push({
        query: {redirectURL: from.fullPath},
        path: '/account/login'
        });
    }
  }
});