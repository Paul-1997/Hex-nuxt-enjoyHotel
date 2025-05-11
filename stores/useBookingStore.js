import { defineStore } from "pinia";

const useBookingStore = defineStore("BookingStore", () => {

  const { baseURL } = useRuntimeConfig().public;
  const token = useCookie('HotelToken');
  const bookingData = ref({
    // 預訂房間
    roomId: '',
    // 預定日期資訊
    checkInDate: '',
    checkOutDate: '',
    peopleNum : 1,
  })
  const daysDiff = ref(0);
  
  const getBookingOrders = async () => {
    const { result } = await $fetch('/orders', {
      method: 'GET',
      baseURL,
      headers: {
        Authorization: token.value ||''
      }
    })
    console.log(result);
    return result
  };
  const getBookingOrderById = async (id) => {
    const { result } = await $fetch(`/orders/${id}`, {
      method: 'GET',
      baseURL,
      headers: {
        Authorization: token.value ||''
      }
    })
    console.log(result);
    return result
  };
  const updateBookingOrder = async (formData) => {
    console.log(formData);
    const { result } = await $fetch('/orders', {
      method: 'POST',
      baseURL,
      headers: {
        Authorization: token.value ||''
      },
      body: formData
    })
    return result;
  };
  const deleteBookingOrder = async (id) => {
    const { data } = await $fetch(`/orders/${id}`, {
      method: 'DELETE',
      baseURL,
      headers: {
        Authorization: token.value ||''
      }
    })
    console.log('data',data);
  };
  return {
    bookingData,
    daysDiff,
    getBookingOrders,
    getBookingOrderById,
    updateBookingOrder,
    deleteBookingOrder,
  }
})


export default useBookingStore;