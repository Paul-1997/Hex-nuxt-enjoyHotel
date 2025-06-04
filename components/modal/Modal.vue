<template>
  <div>
    <!-- Bootstrap Modal -->
    <div
      id="Modal"
      ref="modalRef"
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="dynamicModalLabel" 
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              id="dynamicModalLabel"
              class="modal-title"
            >
              <slot name="title">
                {{ props.modalType }}
              </slot>
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              aria-label="Close"
              @click="closeModal"
            />
          </div>
          <div class="modal-body">
            <!-- 動態載入的元件將在這裡渲染 -->
            <ClientOnly>
              <component
                :is="DynamicComponent"
                v-if="DynamicComponent"
              />
            </ClientOnly>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
            >
              關閉
            </button>
            <button
              type="button" 
              class="btn btn-primary"
              @click="handleConfirm"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 建立modal實例
const { $bootstrap } = useNuxtApp()
const modalRef = ref(null)
const modal = ref(null)

const props = defineProps({
  modalType: {
    type: String || null,
    default: null
  }
})

const emit = defineEmits(['confirm'])

// 初始化 modal
onMounted(() => {
  if (process.client) {
    modal.value = new $bootstrap.Modal(modalRef.value, {
      backdrop: 'static',
      keyboard: false
    })
    
    // 監聽 modal 隱藏事件
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      DynamicComponent.value = null
    })
  }
})

// 清理事件監聽
onUnmounted(() => {
  if (process.client && modalRef.value) {
    modalRef.value.removeEventListener('hidden.bs.modal', () => {
      DynamicComponent.value = null
    })
    modal.value.dispose()
  }
})

// 開關modal的方法
const openModal = () => {
  if (modal.value) {
    modal.value.show()
  }
}

const closeModal = () => {
  if (modal.value) {
    modal.value.hide()
    DynamicComponent.value = null
  }
}

const handleConfirm = () => {
  emit('confirm')
  closeModal()
}

defineExpose({
  openModal,
  closeModal
})

const DynamicComponent = ref(props.modalType)

// 動態載入元件
watch(() => props.modalType, (newVal) => {
  if (newVal === null) return
  if (newVal) {
    DynamicComponent.value = defineAsyncComponent(() => 
      import(`~/components/modal/OrderDetail.vue`)
    )
  }
})
</script>
