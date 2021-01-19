<template>
  <da-app class="app" checkVersion>
    <AppLayout />
  </da-app>
</template>

<script>
import DaApp from '~~/components/elems/DaApp.vue'
import AppLayout from '@/components/AppLayout.vue'

export default {
  components: {
    DaApp,
    AppLayout
  }
}
</script>

<style lang="scss">
@import '../src/assets/global.scss';
.content {
  min-height: 600px;
}
</style>
