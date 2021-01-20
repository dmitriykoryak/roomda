<template>
  <div v-if="loading.active" class="da-overlay">
    <div>
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    loading: state => state.Query.loading
  })
}
</script>

<style lang="scss" scoped>
.da-overlay {
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 400%;
  background-color: #ffffff;
  opacity: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;

    .loader {
      height: 32px;
      width: 32px;
      background: url('/images/loader.gif') no-repeat;
    }
  }
}
</style>
