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
      ...option
    })
  }
  // 高複雜度的彈出提示
  const showAlert = async param => await $Swal.fire(param)

  return {
    errorAlert,
    showToast,
    showAlert
  }
}

export default useAlert
