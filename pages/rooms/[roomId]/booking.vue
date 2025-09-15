<script setup>
import zipcodeSelector from '~/components/zipcodeSelector.vue';
import BookingLoading from '~/components/rooms/BookingLoading.vue';
import DatePickerModal from '@/components/rooms/DatePickerModal.vue'
import { Icon } from '@iconify/vue';

definePageMeta({ middleware: 'auth'});


const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();
const { getBookingOrders,updateBookingOrder } = useBookingStore();
const { bookingData, daysDiff } = storeToRefs(bookingStore);
const { getUserInfo, checkLogin } = useUserStore();
const { userInfo } = storeToRefs(useUserStore());
const goBack = () => {
  const roomId = route.path.split('/')[2];
  const path = roomId === roomDetail._id ? `/rooms/${roomId}` : `/rooms/${roomDetail._id}`;
  
  router.push(path);
};

const isLoading = ref(false);

// 確認送出表單
const confirmBooking = async () => {
  // 先做表單驗證
  if (!await checkFromValidate()) return;
  // 訂單資訊驗證
  if (checkOrderValidate()) {
    isLoading.value = true;
    // 送出訂單
    try {
      await updateBookingOrder({
        roomId: roomDetail?._id,
        checkInDate: bookingData.value.checkInDate,
        checkOutDate: bookingData.value.checkOutDate,
        peopleNum: bookingData.value.peopleNum,
        userInfo: { ...userInfo.value }
      })
      const data = await getBookingOrders();
      console.log(data);
    } 
    catch (error) {
      errorAlert('訂房失敗', error?.response?._data.message)
    }
    finally {
      isLoading.value = false
    }
  }
}
const form = ref(null)
const checkFromValidate = async () => {
  const { valid } = await form.value.validate();
  // check address city and county
  if (!formData.address.city || !formData.address.county) {
    await form.value.setErrors({
      address: '請選擇地址'
    })
    return false;
  }
  return valid;
}
const checkOrderValidate = () => {
  if (daysDiff.value <= 0) return false;
  if (!bookingData.value.roomId || bookingData.value.checkInDate === '' || bookingData.value.checkOutDate === "") return false;
  return true;
}

// for copy USER data
const zipCode = ref('');

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  address: {
    city: '',
    county: '',
    detail: '',
  }
});
const handleAddressUpdate = (data) => {
  formData.address.city = data.city;
  formData.address.county = data.county;
  zipCode.value = "";
};

const { fetchApi } = useApiClient()
const { data, refresh } = await useAsyncData('room', () => {
  const roomId = route.params.roomId;
  return fetchApi(`rooms/${roomId}`);
});
const roomDetail = ref({});
roomDetail.value = data.value.result;

const clipUserData = async () => {
  const isLogin = await checkUserLogin();
  if (isLogin) {
    try {
      await getUserInfo();

      formData.name = userInfo.value.name;
      formData.phone = userInfo.value.phone;
      formData.email = userInfo.value.email;
      // 鄉鎮會被emit的部分做更新 這邊就不處理
      zipCode.value = userInfo.value.address.zipcode;
      formData.address.detail = userInfo.value.address.detail;
    }
    catch (error) {
      errorAlert('取得會員資料失敗', error?.response?._data.message)
    }
  }
};
const checkUserLogin = async () => {
  try {
    return await checkLogin();
  } catch (error) {
    if (error.status === 403) return false
  }
}

// 訂單編輯
const isBookingRoomEdit = ref(false);
const isBookingDateEdit = ref(false);
const isBookingPeopleEdit = ref(false);
let roomArr = ref([]);
const edit_selectedRoom = ref("");

const currDate = new Date();
const edit_selectedDate = reactive({
  date: {
    start: bookingData.value.checkInDate,
    end: bookingData.value.checkOutDate
  },
  minDate: new Date(),
  maxDate: new Date(currDate.setFullYear(currDate.getFullYear() + 1))
})
// ROOM
watchEffect(async ()=> {
  if(isBookingRoomEdit.value && !roomArr.length){
    const { result } = await fetchApi(`rooms/`);
    roomArr.value = result.map(room => {
      const {name , _id } = room;
      return { name, _id };
    })
    edit_selectedRoom.value = route.params.roomId;
  }
})
const handleEditRoom = async () => {
  if( edit_selectedRoom.value === route.params.roomId) return 
  route.params.roomId = edit_selectedRoom.value;
  // 重新取得房間相關資料
  await refresh();
  // 記得要重新賦值
  roomDetail.value = data.value.result;
  isBookingRoomEdit.value = false;
}
// date
const datePickerModal = ref(null);

const editDate = () => {
  isBookingDateEdit.value = true;
  datePickerModal.value.openModal();
}

const handleEditDate = (editedDate) => {
  const { start, end } = editedDate.date;
  bookingData.value.checkInDate = start;
  bookingData.value.checkOutDate = end;
  daysDiff.value = editedDate.daysCount.value;
}


//進入頁面時察看是否有預定套房資料，若沒有就導回房間預定頁面
onMounted(async () => {
  if (!bookingData.value.checkInDate || !bookingData.value.checkOutDate) goBack()
})

</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon
            class="fs-5 text-neutral-100"
            icon="mdi:keyboard-arrow-left"
          />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
            確認訂房資訊
          </h1>
        </button>
        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  v-if="!isBookingRoomEdit"
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      選擇房型
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ roomDetail.name }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="isBookingRoomEdit = true"
                  >
                    編輯
                  </button>
                </div>
                <div v-else>
                  <h3 class="title-deco mb-2 fs-7 fw-bold">
                    選擇房型
                  </h3>
                  <div class="d-flex w-100 align-items-center justify-content-between"> 
                    <select
                      id="editRoom"
                      v-model="edit_selectedRoom"
                      class="form-select"
                      aria-label="select peopleNum"
                      style="width: fit-content;"
                    >
                      <option
                        v-for="room in roomArr"
                        :key="room._id"
                        :value="room._id"
                      >
                        {{ room.name }}
                      </option>
                    </select>
                    <button
                      class="btn btn btn-primary-100 text-neutral-0 border-0 fw-bold"
                      type="button"
                      @click.prevent="handleEditRoom()"
                    >
                      確定
                    </button>
                  </div> 
                </div>

                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      訂房日期
                    </h3>
                    <p class="mb-2 fw-medium">
                      入住：<span v-format-date="bookingData.checkInDate" />
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：<span v-format-date="bookingData.checkOutDate" />
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="editDate"
                  >
                    編輯
                  </button>
                </div>
                <div
                  v-if="!isBookingPeopleEdit"
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      房客人數
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingData.peopleNum }} 人
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="isBookingPeopleEdit = true"
                  >
                    編輯
                  </button>
                </div>
                <div v-else>
                  <h3 class="title-deco mb-2 fs-7 fw-bold">
                    房客人數
                  </h3>
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div class="d-flex align-items-center gap-4">
                      <select
                        id="peopleNum"
                        v-model="bookingData.peopleNum"
                        class="form-select"
                        aria-label="select peopleNum"
                      >
                        <option
                          v-for="num in roomDetail.maxPeople"
                          :key="num"
                          :value="num"
                        >
                          {{ num }} 人
                        </option>
                      </select>
                    </div>
                    <button
                      class="btn btn btn-primary-100 text-neutral-0 border-0 fw-bold"
                      type="button"
                      @click="isBookingPeopleEdit = false"
                    >
                      確定
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <div class="d-flex justify-content-between align-items-center mb-10">
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="clipUserData"
                >
                  套用會員資料
                </button>
              </div>
              <VeeForm
                ref="form"
                as="form"
                class="d-flex flex-column gap-6"
              >
                <VeeField
                  v-slot="{ field }"
                  v-model="formData.name"
                  class="text-neutral-100"
                  name="name"
                  label="姓名"
                  rules="required"
                >
                  <label
                    for="name"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >姓名 </label>
                  <input
                    id="name"
                    v-bind="field"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入姓名"
                  >
                </VeeField>
                <VeeErrorMessage
                  name="name"
                  as="p"
                  class="text-danger fw-bold mt-1 ps-2"
                />
                <VeeField
                  v-slot="{ field }"
                  v-model="formData.phone"
                  class="text-neutral-100"
                  name="phone"
                  label="手機號碼"
                  :rules="{ required: true, regex: /^09\d{8}$/ }"
                >
                  <label
                    for="phone"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >手機號碼</label>
                  <input
                    id="phone"
                    v-bind="field"
                    type="tel"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入手機號碼"
                  >
                </VeeField>
                <VeeErrorMessage
                  name="phone"
                  as="p"
                  class="text-danger fw-bold mt-1 ps-2"
                />
                <VeeField
                  v-slot="{ field }"
                  v-model="formData.email"
                  class="text-neutral-100"
                  name="email"
                  label="電子信箱"
                  rules="required|email"
                >
                  <label
                    for="email"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >電子信箱</label>
                  <input
                    id="email"
                    v-bind="field"
                    type="email"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入電子信箱"
                  >
                </VeeField>
                <VeeErrorMessage
                  name="email"
                  as="p"
                  class="text-danger fw-bold mt-1 ps-2"
                />

                <div class="text-neutral-100">
                  <label
                    for="address"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >地址</label>
                  <zipcodeSelector
                    :zip="zipCode"
                    @update:address="handleAddressUpdate"
                  />
                  <VeeField
                    v-slot="{ field }"
                    v-model="formData.address.detail"
                    class="text-neutral-100"
                    name="address"
                    label="地址"
                    rules="required"
                  >
                    <input
                      id="address"
                      v-bind="field"
                      type="text"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      placeholder="請輸入詳細地址"
                    >
                  </VeeField>
                  <VeeErrorMessage
                    name="address"
                    as="p"
                    class="text-danger fw-bold mt-1 ps-2"
                  />
                </div>
              </VeeForm>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomDetail.areaInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomDetail.bedInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomDetail.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房間格局
                  </h3>
                  <ul class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li
                      v-for="layout in roomDetail.layoutInfo"
                      :key="layout.title"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ layout.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="facility in roomDetail.facilityInfo"
                      :key="facility.title"
                      class="d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ facility.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="amenity in roomDetail.amenityInfo"
                      :key="amenity.title"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ amenity.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="roomDetail.imageUrl"
                :alt="`room-${roomDetail.name}-image`"
              >

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center text-neutral-100 fw-medium">
                    <span v-currency="roomDetail.price" />
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ daysDiff }} 晚</span>
                  </div>
                  <span
                    v-currency="roomDetail.price * daysDiff"
                    class="fw-medium"
                  />
                </div>
                <div class="d-flex justify-content-between align-items-center fw-medium">
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <!-- $ {{ 1000 * daysDiff }}  -->
                  <span
                    v-currency.negative="userInfo?._id ? 1000 * daysDiff : 0"
                    class="text-primary-100"
                  > -NT</span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40">
                <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                  <p class="d-flex align-items-center mb-0">
                    總價
                  </p>
                  <span
                    v-currency="userInfo?._id ? (roomDetail.price - 1000) * daysDiff : (roomDetail.price * daysDiff)"
                  />
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
    <ClientOnly>
      <DatePickerModal
        ref="datePickerModal"
        :date-time="edit_selectedDate"
        :max-booking-people="bookingData.maxBookingPeople"
        @handle-date-change="handleEditDate"
      />
    </ClientOnly>
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  //flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
