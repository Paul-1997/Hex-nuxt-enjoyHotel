import { defineStore } from 'pinia'

const useUserStore = defineStore('userStore', () => {
  const isLogin = ref(false)
  const userInfo = ref(null)

  const { errorAlert } = useAlert()
  const { baseURL } = useRuntimeConfig().public
  const token = useCookie('HotelToken')
  const checkLogin = async () => {
    const res = await $fetch('user/check', {
      method: 'GET',
      baseURL,
      headers: {
        Authorization: token.value ||''
      }
    })
    isLogin.value = res.status
    return isLogin.value
  }
  const userLogin = async (account) => {
    const { token } = await $fetch('user/login', {
      method: 'POST',
      baseURL,
      body: account
    })
    const date = new Date()
    date.setDate(date.getDate() + 7)
    const cookie = useCookie('HotelToken', { expires: date })
    cookie.value = token
  }
  const userLogout = async () => {
    token.value = undefined
    isLogin.value = false
    navigateTo('/')
  }
  const userSignUp = async (data) => {
    await $fetch('user/signup', {
      method: 'POST',
      baseURL,
      body: data
    })
  }
  const getUserInfo = async () => {
    const { result } = await $fetch('user/', {
      method: 'GET',
      baseURL,
      headers: {
        Authorization: token.value || ''
      }
    })
    userInfo.value = result
  }

  const UpdateUserInfo = async (data) => {
    return await $fetch('user/', {
      method: 'PUT',
      baseURL,
      headers: {
        Authorization: token.value || ''
      },
      body: data
    })
  }

  return { isLogin, userInfo, userLogin, userLogout, userSignUp, checkLogin, getUserInfo, UpdateUserInfo }
})

export default useUserStore
/*
login
signup
forget
check
user(info) get, put

verify
generateCode

get news(mult,single)
get culinary(mult,single)
get rooms(mult,single)

order

admin
 order
 culinary
 rooms\
 news
*/
