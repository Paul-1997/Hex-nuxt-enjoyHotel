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
    try {
      const { result } = await $fetch('/orders', {
        method: 'GET',
        baseURL,
        headers: {
          Authorization: token.value || ''
        }
      })
      return result
    } catch (error) {
      console.error('取得訂單列表失敗:', error)
      throw error
    }
  };

  const getBookingOrderById = async (id) => {
    try {
      const { result } = await $fetch(`/orders/${id}`, {
        method: 'GET', 
        baseURL,
        headers: {
          Authorization: token.value || ''
        }
      })
      return result
    } catch (error) {
      console.error('取得訂單詳情失敗:', error)
      throw error
    }
  };

  const updateBookingOrder = async (formData) => {
    try {
      const { result } = await $fetch('/orders', {
        method: 'POST',
        baseURL,
        headers: {
          Authorization: token.value || ''
        },
        body: formData
      })
      return result
    } catch (error) {
      console.error('更新訂單失敗:', error)
      throw error  
    }
  };

  const deleteBookingOrder = async (id) => {
    try {
      const result = await $fetch(`/orders/${id}`, {
        method: 'DELETE',
        baseURL,
        headers: {
          Authorization: token.value || ''
        }
      })
      console.log(result,'delete');
      return result
    } catch (error) {
      console.error('刪除訂單失敗:', error)
      throw error
    }
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