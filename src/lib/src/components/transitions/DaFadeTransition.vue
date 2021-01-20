<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
