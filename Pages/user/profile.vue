<script setup>
import zipcode from '~/assets/zipcode'

definePageMeta({ layout: 'user', middleware: 'auth' })
const isEditPassword = ref(false)
const isEditProfile = ref(false)

const { getUserInfo, UpdateUserInfo } = useUserStore()
const { userInfo } = storeToRefs(useUserStore())

const clonedUserInfo = ref({})
const editBirthday = reactive({
  year: '',
  month: '',
  date: ''
})
const editAddress = reactive({
  city: '',
  county: '',
  detail: ''
})
const handleEditProfile = async () => {
  const data = {
    userId: clonedUserInfo.value._id,
    name: clonedUserInfo.value.name,
    phone: clonedUserInfo.value.phone,
    birthday: `${editBirthday.year}/${editBirthday.month}/${editBirthday.date}`,
    address: {
      zipcode: editAddress.county,
      detail: editAddress.detail
    }
  }
  try {
    await UpdateUserInfo(data)
    await getUserInfo()
    isEditProfile.value = false
  } catch (error) {
    console.log(error.response)
  }
}
const cancelEdit = (type) => {
  if (type === 'profile') {
    clonedUserInfo.value = JSON.parse(JSON.stringify(userInfo.value))
    isEditProfile.value = false
  }
}

// reset pwd
const oldPassword = ref('')
const newPassword = ref('')
// const confirmPassword = ref('')
// const handleEditPwd = () => {

// }
onMounted(async () => {
  await getUserInfo()
})

watch(
  userInfo,
  () => {
    clonedUserInfo.value = JSON.parse(JSON.stringify(userInfo.value))
  },
  { deep: true }
)
watch(isEditProfile, () => {
  if (isEditProfile.value) {
    const date = new Date(userInfo.value.birthday)
    editBirthday.year = date.getFullYear()
    editBirthday.month = date.getMonth() + 1
    editBirthday.date = date.getDate()
    for (const city in zipcode) {
      for (const area in zipcode[city]) {
        if (+zipcode[city][area] === userInfo.value.address.zipcode) {
          editAddress.city = city
          editAddress.county = +zipcode[city][area]
          editAddress.detail = userInfo.value.address.detail
          return
        }
      }
    }
  }
})
const userBirthday = computed(() => {
  if (!userInfo?.value?._id) { return '' }
  const date = new Date(userInfo.value.birthday)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y} 年 ${m} 月 ${d} 日`
})
const userAddress = computed(() => {
  if (!userInfo?.value?._id) { return '' }
  for (const city in zipcode) {
    for (const area in zipcode[city]) {
      if (+zipcode[city][area] === userInfo.value.address.zipcode) { return `${city}${area}${userInfo.value.address.detail}` }
    }
  }
})
// // zipcode data
const cites = Object.keys(zipcode)
const county = computed(() => {
  if (editAddress.city === '') { return [] }
  return Object.keys(zipcode[editAddress.city]).map(key => [key, zipcode[editAddress?.city][key]])
})
</script>

<template>
  <!-- <div id="signUpStep1" v-if="step < 2">
        <div class="mb-4 fs-8 fs-md-7">

        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
          <VeeField
            v-slot="{ meta, field }"
            type="password"
            name="password"
            label="密碼"
            v-model="formData.password"
            :keep-value="true"
          >
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
            :keep-value="true"
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

          </div>
        </div>
         -->
  <VeeForm
    ref="form"
    class="row gap-6 gap-md-0"
    as="form"
    @submit="handleEditProfile"
  >
    <!--profile -->
    <div class="col-12 col-md-5">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          修改密碼
        </h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">
              電子信箱
            </p>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">{{ userInfo?.email }}</span>
          </div>

          <div
            class="d-flex justify-content-between align-items-center"
            :class="{ 'd-none': isEditPassword }"
          >
            <div>
              <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium"> 密碼 </label>
              <input
                class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                type="password"
                value="**********"
              >
            </div>

            <button
              class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
              type="button"
              @click="isEditPassword = !isEditPassword"
            >
              重設
            </button>
          </div>

          <div
            class="d-flex flex-column gap-4 gap-md-6"
            :class="{ 'd-none': !isEditPassword }"
          >
            <div>
              <label
                for="oldPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >舊密碼</label>
              <input
                id="oldPassword"
                v-model="oldPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入舊密碼"
              >
            </div>

            <div>
              <label
                for="newPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >新密碼</label>
              <input
                id="newPassword"
                v-model="newPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入新密碼"
              >
            </div>

            <div>
              <label
                for="confirmPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >確認新密碼</label>
              <input
                id="confirmPassword"
                v-model="ConfirmPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請再輸入一次新密碼"
              >
            </div>
          </div>

          <button
            :class="{ 'd-none': !isEditPassword }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="button"
          >
            儲存設定
          </button>
        </div>
      </section>
    </div>
    <div class="col-12 col-md-7">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          基本資料
        </h2>
        <hr>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }"
              for="name"
            >
              姓名
            </label>
            <VeeField
              id="name"
              v-model="clonedUserInfo.name"
              type="text"
              name="name"
              label="姓名"
              placeholder="請輸入姓名"
              rules="required"
              class="form-control text-neutral-100 fw-bold"
              :class="{ 'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile }"
            />
            <VeeErrorMessage
              name="name"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }"
              for="phone"
            >
              手機號碼
            </label>
            <VeeField
              id="phone"
              v-model.trim="clonedUserInfo.phone"
              type="tel"
              name="phone"
              label="手機號碼"
              :rules="{ required: true, regex: /^09\d{8}$/ }"
              class="form-control text-neutral-100 fw-bold"
              :class="{ 'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile }"
              placeholder="請輸入手機號碼 ex: 09xxxxxxxx"
              inputmode="numeric"
            />
            <VeeErrorMessage
              name="phone"
              as="p"
              class="text-danger fw-bold mt-1 ps-2"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }"
              for="birth"
            >
              生日
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
            >{{ userBirthday }}</span>
            <div
              class="d-flex gap-2"
              :class="{ 'd-none': !isEditProfile }"
            >
              <VeeField
                id="birth"
                v-slot="{ value }"
                v-model="editBirthday.year"
                as="select"
                name="birthday_year"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="year in 65"
                  :key="year"
                  :value="year + 1958"
                  :selected="value !== ''"
                >
                  {{ year + 1958 }} 年
                </option>
              </VeeField>
              <VeeField
                v-slot="{ value }"
                v-model="editBirthday.month"
                as="select"
                name="birthday_month"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="month in 12"
                  :key="month"
                  :value="month"
                  :selected="value !== ''"
                >
                  {{ month }} 月
                </option>
              </VeeField>
              <VeeField
                v-slot="{ value }"
                v-model="editBirthday.date"
                as="select"
                name="birthday_day"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="day in 30"
                  :key="day"
                  :value="day"
                  :selected="value !== ''"
                >
                  {{ day }} 日
                </option>
              </VeeField>
            </div>
          </div>
          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }"
              for="address"
            >
              地址
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
            >{{ userAddress }}</span>
            <div :class="{ 'd-none': !isEditProfile }">
              <div class="d-flex gap-2 mb-2">
                <select
                  v-model="editAddress.city"
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
                  v-model="editAddress.county"
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
                v-model="editAddress.detail"
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
                  :disabled="editAddress.city === '' || editAddress.county === '' || editAddress.city === undefined"
                  :class="{ 'opacity-75 disabled': editAddress.city === '' || editAddress.county === '' }"
                >
              </VeeField>
              <VeeErrorMessage
                name="address"
                as="p"
                class="text-danger fw-bold mt-1 ps-2"
              />
            </div>
          </div>
          <div>
            <button
              :class="{ 'd-none': isEditProfile }"
              class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
              type="button"
              @click="isEditProfile = !isEditProfile"
            >
              編輯
            </button>
            <div
              class="btn-group d-inline-block"
              :class="{ 'd-none': !isEditProfile }"
            >
              <button
                class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3 me-4"
                type="submit"
              >
                儲存設定
              </button>
              <button
                class="btn btn-outline-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
                type="button"
                @click="cancelEdit('profile')"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </VeeForm>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type='password'] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
