<script setup>
definePageMeta({
  layout: 'account'
})
const { errorAlert } = useAlert()
// login
const { userLogin } = useUserStore();
const route = useRoute();
const account = reactive({
  email: '',
  password: ''
})
const rememberAccount = ref(false)
const isAdminMode = ref(false)

const handleLogin = async () => {
  try {
    await userLogin(account);
    if (rememberAccount.value === true) { 
        localStorage.setItem('HotelUserEmail', account.email) 
      }

    if (isAdminMode.value) {
      navigateTo('/admin')
    } else {
      // 確認一下是否要重新導向
      const getPath = ({redirectURL,isAdmin}) => { 
        if (isAdmin) return '/admin'
        return redirectURL ? redirectURL : '/'; 
      }
      navigateTo(getPath(route.query));
    }
  } catch (error) {
    errorAlert('登入失敗', error?.response?._data?.message || '帳號或密碼不正確')
  }
}

const toggleLoginMode = () => {
  isAdminMode.value = !isAdminMode.value
  // 切換模式時清空表單
  account.email = ''
  account.password = ''
  rememberAccount.value = false
}

// TODO: 之後補上

const handleForgetPwd = async () => {}
// rememberAccount
onMounted(() => {
  const localUserEmail = localStorage.getItem('HotelUserEmail') || undefined
  if (localUserEmail) {
    rememberAccount.value = true
    account.email = localUserEmail
  }
})
</script>
<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">
        立即開始旅程
      </h1>
    </div>
    <VeeForm
      class="mb-10"
      @submit="handleLogin()"
    >
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="email"
        > 電子信箱 </label>
        <VeeField
          id="email"
          v-model="account.email"
          name="email"
          label="信箱"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
          rules="required|email"
        />
        <VeeErrorMessage
          name="email"
          class="fw-bold text-danger mt-2"
          as="p"
        />
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="password"
        > 密碼 </label>
        <VeeField
          id="password"
          v-model="account.password"
          name="password"
          label="密碼"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入密碼"
          type="password"
          rules="required||min:8"
        />
        <VeeErrorMessage
          name="password"
          class="fw-bold text-danger mt-2"
          as="p"
        />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input
            id="remember"
            v-model="rememberAccount"
            class="form-check-input"
            type="checkbox"
          >
          <label
            class="form-check-label fw-bold"
            for="remember"
          > 記住帳號 </label>
        </div>
        <button
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
          type="button"
          @click="handleForgetPwd"
        >
          忘記密碼？
        </button>
      </div>
      <button
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="submit"
      >
        {{ isAdminMode ? '管理者登入' : '會員登入' }}
      </button>
    </VeeForm>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">{{ isAdminMode ? '返回會員登入？' : '沒有會員嗎？' }}</span>
      <template v-if="!isAdminMode">
        <NuxtLink
          to="signup"
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
        >
          <span>前往註冊</span>
        </NuxtLink>
        <span class="mx-2 text-neutral-0">|</span>
      </template>
      <button
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
        @click="toggleLoginMode"
      >
        {{ isAdminMode ? '會員登入' : '管理者登入' }}
      </button>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/mixins/breakpoints';

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

input[type='password'] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}
</style>
