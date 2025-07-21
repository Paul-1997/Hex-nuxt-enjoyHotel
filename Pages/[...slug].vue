<script setup>

definePageMeta({ layout: false })

// 否則會回傳200 成功
const router = useRouter();
const event = useRequestEvent()
setResponseStatus(event, 404)

const backToHome = () => router.push('/');

</script>
<template>
  <div style="background-color: #4b4b4bce">
    <div class="error__container min-vh-100">
      <div class="error__content d-flex flex-wrap justify-content-center align-items-center">
        <h1 class="error__content__statusCode">
          404
        </h1>
        <div class="error__content__message">
          <p class="mb-5">
            噢不！發生了一些意外 🙁
          </p>
          <div class="mb-5">
            <p>找不到該頁面</p>
          </div>
          <button
            type="button"
            class="btn btn-outline-light rounded-3 w-100"
            @click="backToHome"
          >
            點我返回首頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.error{
  &__container{
    align-content: center;
    margin-inline: auto;
    width: min(100% - 4vmin,  1260px);
    color: var(--bs-gray-200)
  }
  &__content{
    gap: 2rem;
    &__statusCode{
      font-size: 10rem;
      font-weight: 700;
    }
    &__message{
      font-size: 20px;
    }
  }
}
</style>
