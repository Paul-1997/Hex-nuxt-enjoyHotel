import Collapse from 'bootstrap/js/dist/collapse'
import Modal from 'bootstrap/js/dist/modal'
import Dropdown from 'bootstrap/js/dist/dropdown'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      bootstrap: {
        Collapse,
        Modal,
        Dropdown,
      }
    }
  }
})
