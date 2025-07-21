<script setup>
import { Icon } from '@iconify/vue'
import zipcode from '~/assets/zipcode'

definePageMeta({
  layout: 'account'
})
// plugin
const { showAlert, errorAlert } = useAlert()
const { userSignUp } = useUserStore()
// form instance
const form = ref(null)
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  birthday: {
    year: '',
    month: '',
    day: ''
  },
  address: {
    city: '',
    county: '',
    path: ''
  }
})
// form validation
const step = ref(1)
const isEmailAvailable = ref(false)
const isVerifyingEmail = ref(false)
const isEmailAvailableMsg = ref('')
const veeValidateSchema = {
  email: 'required|email',
  password: 'required|min:8',
  confirmPassword: 'required|confirmed:@password',
  name: 'required',
  phone: { required: true, regex: /^09\d{8}$/ },
  birthday_year: v => (v ? true : '請選擇年分'),
  birthday_month: v => (v ? true : '請選擇月分'),
  birthday_day: v => (v ? true : '請選擇日期'),
  address: (value) => {
    if (formData.address.city === '' || formData.address.county === '' || value === '') { return '請填寫地址' }
    return true
  },
  agreePolicy: (value) => {
    return value === true ? true : '請同意個資使用規範'
  }
}

const VerifyStepOne = async (validate) => {
  const res = await Promise.all([validate('email'), validate('password'), validate('confirmPassword')])
  if (isEmailAvailable && res.every(r => r.valid)) {
    step.value = 2
  }
}
// all data will be auto validate by vee-validate,
// if all data is valid, then this function will be called
let timerInterval;
const onSubmitForm = async () => {
  // handle data
  const birthday = [formData.birthday.year, formData.birthday.month, formData.birthday.day]
    .map(x => x.split(' ')[0])
    .join('/')

  const data = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    birthday,
    address: {
      zipcode: formData.address.county,
      detail: formData.address.path
    }
  }
  try {
    await userSignUp(data)
    // 彈出視窗5s後 導向至login頁面
    const { isConfirmed } = await showAlert('註冊成功!', {
      text: '將在 5 秒後重新導向至登入',
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      confirmButtonText: '立即跳轉',
      didOpen: () => {
        const timer = $Swal.getHtmlContainer()
        timerInterval = setInterval(() => {
          timer.textContent = `將在 ${Math.ceil($Swal.getTimerLeft() / 1000)} 秒後跳轉頁面`
        }, 1000)
      },
      willClose: () => {
        clearInterval(timerInterval)
        navigateTo('login')
      }
    })
    if (isConfirmed) { navigateTo('login') }
  } catch (error) {
    const msg = error?.response?._data?.message || ''
    errorAlert('註冊失敗', msg)
  }
}
// check email is verified or not when input
const { fetchApi } = useApiClient()
const checkEmailVerification = debounce(async () => {
  try {
    isVerifyingEmail.value = true
    isEmailAvailable.value = false
    const response = await fetchApi('verify/email', {
      method: 'POST',
      body: { email: formData.email }
    })
    isEmailAvailable.value = !response?.result?.isEmailExists
    isEmailAvailableMsg.value = isEmailAvailable.value ? '' : '此信箱已被註冊'
  } catch (error) {
    console.error(error);
  } finally {
    isVerifyingEmail.value = false
  }
})

// zipcode data
const cites = Object.keys(zipcode)
const county = computed(() => {
  if (formData.address.city === '') { return [] }
  return Object.keys(zipcode[formData.address.city]).map(key => [key, zipcode[formData.address?.city][key]])
})
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">
        立即註冊
      </h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': step === 2 }"
            class="step p-2 bg-primary-100 rounded-circle"
          >1</span>
          <Icon
            :class="{ 'd-none': step < 2 }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            輸入信箱及密碼
          </p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100">

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
          >2</span>
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            填寫基本資料
          </p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VeeForm
        ref="form"
        v-slot="{ errors, validateField }"
        class="mb-4"
        as="form"
        :validation-schema="veeValidateSchema"
        @submit="onSubmitForm()"
      >
        <!-- step1 -->
        <div
          v-if="step < 2"
          id="signUpStep1"
        >
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="email"
            > 電子信箱 </label>
            <VeeField
              v-slot="{ meta, field }"
              v-model="formData.email"
              type="email"
              name="email"
              label="電子信箱"
              :keep-value="true"
              @update:model-value="((isEmailAvailableMsg = ''), checkEmailVerification())"
            >
              <input
                v-bind="field"
                id="email"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.email, 'is-valid': meta.valid && isEmailAvailable }"
                placeholder="請輸入電子信箱"
              >
              <div
                v-if="!errors.email && meta.dirty"
                class="fw-bold mt-2"
              >
                <p
                  v-if="isVerifyingEmail && !isEmailAvailable"
                  class="text-secondary"
                >
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  />驗證中
                </p>
                <p
                  v-else
                  class="text-danger"
                >
                  {{ isEmailAvailableMsg }}
                </p>
              </div>
            </VeeField>
            <VeeErrorMessage
              name="email"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="password"
            > 密碼 </label>
            <VeeField
              v-slot="{ meta, field }"
              v-model="formData.password"
              type="password"
              name="password"
              label="密碼"
              :keep-value="true"
            >
              <input
                v-bind="field"
                id="password"
                type="password"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.password, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入密碼"
              >
            </VeeField>
            <VeeErrorMessage
              name="password"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <div class="mb-10 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="confirmPassword"
            > 確認密碼 </label>
            <VeeField
              v-slot="{ meta, field }"
              v-model="formData.confirmPassword"
              type="password"
              name="confirmPassword"
              label="確認密碼"
              :keep-value="true"
            >
              <input
                v-bind="field"
                id="confirmPassword"
                type="password"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.confirmPassword, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請再輸入一次密碼"
              >
            </VeeField>
            <VeeErrorMessage
              name="confirmPassword"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <button
            class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
            type="button"
            @click="VerifyStepOne(validateField)"
          >
            下一步
          </button>
        </div>
        <div
          v-else
          id="signUpStep2"
        >
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="name"
            > 姓名 </label>
            <VeeField
              v-slot="{ meta, field }"
              v-model="formData.name"
              type="text"
              name="name"
              label="姓名"
            >
              <input
                v-bind="field"
                id="name"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.name, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入姓名"
              >
            </VeeField>
            <VeeErrorMessage
              name="name"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="phone"
            > 手機號碼 </label>
            <VeeField
              v-slot="{ meta, field }"
              v-model.trim="formData.phone"
              type="text"
              name="phone"
              label="手機號碼"
            >
              <input
                v-bind="field"
                id="phone"
                type="text"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors.phone, 'is-valid': meta.valid && meta.dirty }"
                placeholder="請輸入手機號碼 ex: 09xxxxxxxx"
                inputmode="numeric"
              >
            </VeeField>
            <VeeErrorMessage
              name="phone"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="birth"
            > 生日 </label>
            <div class="d-flex gap-2">
              <VeeField
                id="birth"
                v-slot="{ value }"
                v-model="formData.birthday.year"
                as="select"
                name="birthday_year"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="year in 65"
                  :key="year"
                  :value="`${year + 1958} 年`"
                  :selected="value !== ''"
                >
                  {{ year + 1958 }} 年
                </option>
              </VeeField>
              <VeeField
                v-slot="{ value }"
                v-model="formData.birthday.month"
                as="select"
                name="birthday_month"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="month in 12"
                  :key="month"
                  :value="`${month} 月`"
                  :selected="value !== ''"
                >
                  {{ month }} 月
                </option>
              </VeeField>
              <VeeField
                v-slot="{ value }"
                v-model="formData.birthday.day"
                as="select"
                name="birthday_day"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="day in 30"
                  :key="day"
                  :value="`${day} 日`"
                  :selected="value !== ''"
                >
                  {{ day }} 日
                </option>
              </VeeField>
            </div>
            <VeeErrorMessage
              v-if="errors.birthday_year"
              name="birthday_year"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
            <VeeErrorMessage
              v-else-if="errors.birthday_month"
              name="birthday_year"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
            <VeeErrorMessage
              v-else
              name="birthday_year"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="form-label text-neutral-0 fw-bold"
              for="address"
            > 地址 </label>
            <div>
              <div class="d-flex gap-2 mb-2">
                <select
                  v-model="formData.address.city"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                >
                  <option
                    value=""
                    disabled
                    selected
                  >
                    請選擇城市
                  </option>
                  <option
                    v-for="city in cites"
                    :key="city"
                    :value="city"
                  >
                    {{ city }}
                  </option>
                </select>
                <select
                  v-model="formData.address.county"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                >
                  <option
                    value=""
                    disabled
                    selected
                  >
                    請選擇地區
                  </option>
                  <option
                    v-for="County in county"
                    :key="County"
                    :value="County[1]"
                  >
                    {{ `${County[1]} ${County[0]}` }}
                  </option>
                </select>
              </div>
              <VeeField
                v-slot="{ field }"
                v-model="formData.address.path"
                type="text"
                name="address"
                label="地址"
              >
                <input
                  v-bind="field"
                  id="address"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  placeholder="請輸入詳細地址"
                  :disabled="
                    formData.address.city === '' ||
                      formData.address.county === '' ||
                      formData.address.city === undefined
                  "
                  :class="{ 'opacity-75 disabled': formData.address.city === '' || formData.address.county === '' }"
                >
              </VeeField>
              <VeeErrorMessage
                name="address"
                as="p"
                class="text-danger fw-bold mt-1 ps-2"
              />
            </div>
          </div>

          <div class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0">
            <VeeField
              id="agreementCheck"
              name="agreePolicy"
              type="checkbox"
              class="form-check-input"
              :value="true"
            />
            <label
              class="form-check-label fw-bold"
              for="agreementCheck"
            > 我已閱讀並同意本網站個資使用規範 </label>
          </div>
          <VeeErrorMessage
            name="agreePolicy"
            as="p"
            class="text-danger fw-bold"
          />
          <button
            class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
            type="submit"
          >
            完成註冊
          </button>
        </div>
      </VeeForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
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
