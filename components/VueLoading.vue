<!-- <script setup>
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: () => false
    }
  })
  onMounted(()=>{

  })
  const vlParent = ref(null);
  const { $loading } = useNuxtApp();
  const loader = $loading();

  watchEffect(()=> {
    if(props.isActive) {
      loader.show({
    opacity: .25,
    'is-full-page': false,
    loader:'dots',
    width:64,
    height:64,
    container: vlParent.value
  })
    }
    
  })
</script>
<template>
  <div
    ref="vlParent"
    class="vl-parent d-inline-block ms-4"
  />
</template> -->
