<script setup>
import { Title } from '#components';

definePageMeta({
  layout: 'account',
});
const rememberAccount = ref(false);
const account = reactive({
  email: '',
  password: '',
});
const { $Swal } = useNuxtApp();

const handleLogin = async ()=> {
  try {
    const { token } = await $fetch('https://freyja-01v8.onrender.com/api/v1/user/login', {
      method: 'POST',
      body: account,
    });
    const date = new Date();
    const cookie = useCookie('HotelToken',{expires: date.setDate(date.getDate()+7)});
    cookie.value = token;
    if(rememberAccount.value === true) {
      localStorage.setItem('HotelUserEmail', account.email);
    }
    navigateTo('/');
  } catch (error) {
    console.log(error.response);
    $Swal.fire({
      title: error.response._data.message,
      icon: 'error',
    })
  }
};
const handleForgetPwd = async ()=> {};

</script>
<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">享樂酒店，誠摯歡迎</p>
      <h1 class="text-neutral-0 fw-bold">立即開始旅程</h1>
    </div>
    <VeeForm class="mb-10" @submit="handleLogin()">
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="email"> 電子信箱 </label>
        <VeeField
          id="email"
          name="email"
          label="信箱"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
          rules="required|email"
          v-model="account.email"
        />
        <VeeErrorMessage name="email" class="fw-bold text-danger mt-2" as="p" />
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
        <VeeField
          id="password"
          name="password"
          label="密碼"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入密碼"
          type="password"
          rules="required||min:8"
          v-model="account.password"
        />
        <VeeErrorMessage name="password" class="fw-bold text-danger mt-2" as="p" />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input id="remember" class="form-check-input" type="checkbox" v-model="rememberAccount" />
          <label class="form-check-label fw-bold" for="remember"> 記住帳號 </label>
        </div>
        <button class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0" type="button" @click="handleForgetPwd">
          忘記密碼？
        </button>
      </div>
      <button class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold" type="submit">會員登入</button>
    </VeeForm>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink to="signup" class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0">
        <span>前往註冊</span>
      </NuxtLink>
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
