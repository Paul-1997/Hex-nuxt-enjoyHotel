<template>
  <div>
    <!-- Bootstrap Modal -->
    <div
      :id="modalName"
      ref="modalRef"
      class="modal fade" 
      tabindex="-1" 
      :aria-labelledby="modalName" 
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <slot name="title">
            <div class="modal-header">
              <h5
                :id="`${modalName}-title`"
                class="modal-title"
              >
                Modal Title
              </h5>
              <button 
                type="button" 
                class="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              />
            </div>
          </slot>
          
          <!-- Modal Body -->
          <div class="modal-body">
            <slot name="body" />
          </div>
          
          <!-- Modal Footer -->
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const { modalName } = defineProps({
  modalName: {
    type: String,
    required: true
  }
})

// 建立modal實例
const { $bootstrap } = useNuxtApp()
const modalRef = ref(null)
const modal = ref(null)

// 初始化 modal
onMounted(() => {
  if (import.meta.client) {
    modal.value = new $bootstrap.Modal(modalRef.value, {
      backdrop: 'static',
      keyboard: false
    })
  }
})

// 清理事件監聽
onUnmounted(() => {
  modal.value.dispose()
})

// 開關modal的方法
const openModal = () => {
  modal.value.show()
}

const closeModal = () => {
  modal.value.hide()
}

// 暴露方法給父組件
defineExpose({
  openModal,
  closeModal
})
</script>

