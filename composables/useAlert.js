const useAlert = () => {
  const { $Swal } = useNuxtApp()
  // 錯誤反饋
  const errorAlert = async (title = '出錯了😣', text = '', option) =>
    await $Swal.fire({
      icon: 'error',
      title,
      text,
      ...option
    })

  // 狀態使用者反饋
  const showToast = (title, icon, option) => {
    $Swal.fire({
      toast: true,
      title,
      icon,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
      ...option
    })
  }
  // 高複雜度的彈出提示
  const showAlert = async param => await $Swal.fire(param)
  // 刪除彈出提示
  const showDeleteModal = async (title) => {
    const { isConfirmed } = await $Swal.fire({
      title: `確定要刪除${title}嗎？`,
      text: '此操作無法復原',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DA3E51',
      cancelButtonColor: '#909090',
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消'
    })

    return isConfirmed
  }
  return {
    errorAlert,
    showToast,
    showAlert,
    showDeleteModal
  }
}

export default useAlert
