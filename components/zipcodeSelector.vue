<template>
  <div :class="getClass('container')">
    <select
      v-model="addressData.city"
      :class="getClass('select')"
      @change="addressData.county = ''"
    >
      <option
        value=""
        disabled
        selected
      >
        請選擇城市
      </option>
      <option
        v-for="city in cites"
        :key="city"
        :value="city"
      >
        {{ city }}
      </option>
    </select>
    <select
      v-model="addressData.county"
      :class="getClass('select')"
    >
      <option
        value=""
        disabled
        selected
      >
        請選擇地區
      </option>
      <option
        v-for="County in county"
        :key="County"
        :value="County[1]"
      >
        {{ `${County[1]} ${County[0]}` }}
      </option>
    </select>
  </div>
</template>

<script setup>
import zipcode from '~/assets/zipcode';

const addressData = reactive({
  city: '',
  county: ''
})

const cites = Object.keys(zipcode);
const county = computed(() => {
  if (addressData.city === '') { return [] }
  return Object.keys(zipcode[addressData.city]).map(key => [key, zipcode[addressData?.city][key]])
})


const props = defineProps({
  classes: {
    type: Object,
    default: () => ({
      container: '',
      select: ''
    })
  },
  zip: {
    type: String,
    like: Number,
    default: () => ""
  }
})

const getClass= (type) => {
  const defaultClass = type === 'container' ? "d-flex gap-2 mb-4" : "form-select p-4 text-neutral-80 fw-medium rounded-3";
  return props.classes[type] || defaultClass;
}
// emit 返回組件的值
const emit = defineEmits(['update:address']);
watch(addressData, (newVal) => {
  console.log(newVal);
  emit('update:address', addressData);

});
watch(() => props.zip, (newVal)=>{
  if(!newVal) return;
  for (const city in zipcode) {
    for (const county in zipcode[city]) {
      if (+zipcode[city][county] === newVal) {
        addressData.city = city;
        addressData.county = newVal;
      }
    }
  }
})
</script>
