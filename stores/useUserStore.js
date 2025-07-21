import { defineStore } from 'pinia'

const useUserStore = defineStore('userStore', () => {
  const isLogin = ref(false);
  const userInfo = ref(null);
  const isAdmin = computed(() => userInfo.value?.role === 'admin');

  const { fetchApi, fetchApiWithToken } = useApiClient()

  const checkLogin = async () => {
    const res = await fetchApiWithToken('user/check', {
      method: 'GET'
    })
    isLogin.value = res.status
  }

  const userLogin = async (account) => {
    const { token: authToken } = await fetchApi('user/login', {
      method: 'POST',
      body: account
    })
    const date = new Date()
    date.setDate(date.getDate() + 7)
    const cookie = useCookie('HotelToken', { expires: date })
    cookie.value = authToken
  }

  const userLogout = async () => {
    token.value = null;
    isLogin.value = false;
    navigateTo('/')
  }

  const userSignUp = async (data) => {
    await fetchApi('user/signup', {
      method: 'POST',
      body: data
    })
  }

  const getUserInfo = async () => {
    const { result } = await fetchApiWithToken('user/', {
      method: 'GET'
    })
    userInfo.value = result
  }

  const UpdateUserInfo = async (data) => {
    return await fetchApiWithToken('user/', {
      method: 'PUT',
      body: data
    })
  }

  return { isLogin, isAdmin, userInfo, userLogin, userLogout, userSignUp, checkLogin, getUserInfo, UpdateUserInfo }
})

export default useUserStore
