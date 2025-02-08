<script setup>
definePageMeta({
  layout: 'account',
});
import { Icon } from '@iconify/vue';
const isEmailExist = ref(false);
// const isEmailVerifiedMsg = ref('');
const step = ref(1);
const veeValidateSchema = {
  email: 'required|email',
  password: 'required|min:8',
  confirmPassword: 'required|confirmed:@password',
  name: 'required',
  phone: {required: true, regex: /^09\d{8}$/},
  address: 'required',
};
// form instance
const form = ref(null);
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  address: '',
});

// check email is verified or not
const checkStepOneVerify = async (validate) => {
  
  const res = await Promise.all([
    validate('email'),
    validate('password'),
    validate('confirmPassword'),
  ]);
  if(isEmailExist && res.every(r=> r.valid)){
    step.value = 2;
  }
};

const checkEmailVerification = debounce(async () => {
  try {
    isEmailExist.value = false;
    const response = await $fetch('https://freyja-01v8.onrender.com/api/v1/verify/email', {
      method: 'POST',
      body: { email: formData.email },
    });
    // console.log(response);
    isEmailExist.value = !response?.result?.isEmailExist;
  } catch (error) {
    const { message } = error?.response?._data;
    // console.log(message);
    // if(message) isEmailVerifiedMsg.value = ''
  }
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">享樂酒店，誠摯歡迎</p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span :class="{ 'd-none': step === 2 }" class="step p-2 bg-primary-100 rounded-circle">1</span>
          <Icon
            :class="{ 'd-none': step < 2 }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': step === 2,
            'text-neutral-60': !step === 2,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': step === 2,
              'bg-transparent border border-neutral-60': !step === 2,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VeeForm
        ref="form"
        class="mb-4"
        as="form"
        :validation-schema="veeValidateSchema"
        v-slot="{ errors, validateField }"
      >
        <!-- step1 -->
        <div id="signUpStep1" v-if="step === 1">
          <div class="mb-4 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="email"> 電子信箱 </label>
            <VeeField
              v-slot="{ meta, field }"
              type="email"
              name="email"
              label="電子信箱"
              v-model="formData.email"
              @update:model-value="checkEmailVerification()"
            >
              <input
                v-bind="field"
                id="email"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.email, 'is-valid': meta.valid && meta.dirty && isEmailExist }"
                placeholder="請輸入電子信箱"
              />
            </VeeField>
            <VeeErrorMessage name="email" v-slot="{ message }">
              <p class="text-danger fw-bold mt-1 ps-2">
                {{ !isEmailExist ? message : '此信箱已被註冊' }}
              </p>
            </VeeErrorMessage>          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
            <VeeField v-slot="{ meta, field }" type="password" name="password" label="密碼" v-model="formData.password">
              <input
                v-bind="field"
                id="password"
                type="password"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.password, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入密碼"
              />
            </VeeField>
            <VeeErrorMessage name="password" as="p" class="text-danger fw-bold mt-1 ps-2" />
          </div>
          <div class="mb-10 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword"> 確認密碼 </label>
            <VeeField
              v-slot="{ meta, field }"
              type="password"
              name="confirmPassword"
              label="確認密碼"
              v-model="formData.confirmPassword"
            >
              <input
                v-bind="field"
                id="confirmPassword"
                type="password"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.confirmPassword, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請再輸入一次密碼"
              />
            </VeeField>
            <VeeErrorMessage name="confirmPassword" as="p" class="text-danger fw-bold mt-1 ps-2" />
          </div>
          <button
            class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
            type="button"
            @click="checkStepOneVerify(validateField)"
          >
            下一步
          </button>
        </div>

        <div id="signUpStep2" v-if="step > 1">
          <div class="mb-4 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
            <VeeField v-slot="{ meta, field }" type="text" name="name" label="姓名" v-model="formData.name">
              <input
                v-bind="field"
                id="name"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.name, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入姓名"
              />
            </VeeField>
            <VeeErrorMessage name="name" as="p" class="text-danger fw-bold mt-1 ps-2" />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="phone"> 手機號碼 </label>
            <VeeField v-slot="{ meta, field }" type="text" name="phone" label="手機號碼" v-model.trim="formData.phone">
              <input
                v-bind="field"
                id="phone"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.tel, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入手機號碼 ex: 09xxxxxxxx"
                inputmode="numeric"
              />
            </VeeField>
            <VeeErrorMessage name="phone" as="p" class="text-danger fw-bold mt-1 ps-2" />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
            <div class="d-flex gap-2">
              <select id="birth" class="form-select p-4 text-neutral-80 fw-medium rounded-3">
                <option v-for="year in 65" :key="year" :value="`${year + 1958} 年`">{{ year + 1958 }} 年</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3">
                <option v-for="month in 12" :key="month" :value="`${month} 月`">{{ month }} 月</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3">
                <option v-for="day in 30" :key="day" :value="`${day} 日`">{{ day }} 日</option>
              </select>
            </div>
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label class="form-label text-neutral-0 fw-bold" for="address"> 地址 </label>
            <div>
              <div class="d-flex gap-2 mb-2">
                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3">
                  <option value="臺北市">臺北市</option>
                  <option value="臺中市">臺中市</option>
                  <option selected value="高雄市">高雄市</option>
                </select>
                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3">
                  <option value="前金區">前金區</option>
                  <option value="鹽埕區">鹽埕區</option>
                  <option selected value="新興區">新興區</option>
                </select>
              </div>
              <VeeField v-slot="{ meta, field }" type="text" name="address" label="地址" v-model="formData.address">
                <input
                  v-bind="field"
                  id="address"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  :class="{ 'is-invalid': errors.address, 'is-valid': meta.valid && meta.dirty }"
                  placeholder="請輸入詳細地址"
                />
              </VeeField>
              <VeeErrorMessage name="address" as="p" class="text-danger fw-bold mt-1 ps-2" />
            </div>
          </div>

          <div class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0">
            <input id="agreementCheck" class="form-check-input" type="checkbox" value="" />
            <label class="form-check-label fw-bold" for="agreementCheck"> 我已閱讀並同意本網站個資使用規範 </label>
          </div>
          <button class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold" type="submit">完成註冊</button>
        </div>
      </VeeForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink to="login" class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0">
        <span>立即登入</span>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}

:is(.form-control, input).is-invalid {
  box-shadow: 0 0 1rem var(--bs-danger);
}

:is(.form-control, input).is-valid {
  box-shadow: 0 0 1rem var(--bs-success);
}
</style>
