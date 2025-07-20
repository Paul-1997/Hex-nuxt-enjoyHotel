import { defineStore } from "pinia";

const useBookingStore = defineStore("BookingStore", () => {

  const { fetchApiWithToken } = useApiClient()
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
      const { result } = await fetchApiWithToken('/orders', {
        method: 'GET'
      })
      return result
    } catch (error) {
      console.error('取得訂單列表失敗:', error)
      throw error
    }
  };

  const getBookingOrderById = async (id) => {
    try {
      const { result } = await fetchApiWithToken(`/orders/${id}`, {
        method: 'GET'
      })
      return result
    } catch (error) {
      console.error('取得訂單詳情失敗:', error)
      throw error
    }
  };

  const updateBookingOrder = async (formData) => {
    try {
      const { result } = await fetchApiWithToken('/orders', {
        method: 'POST',
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
      const result = await fetchApiWithToken(`/orders/${id}`, {
        method: 'DELETE'
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