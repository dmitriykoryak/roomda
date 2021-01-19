<template>
  <v-timeline class="da-timeline" :dense="$vuetify.breakpoint.smAndDown">
    <v-slide-x-reverse-transition group>
      <slot name="default"></slot>
    </v-slide-x-reverse-transition>
  </v-timeline>
</template>

<script>
/**
 * Надстройка над v-timeline:
 * - анимированный вылет блоков
 * - оптимизированная под моб. разрешение экрана
 */
export default {
  name: 'da-log-simple'
}
</script>

<style lang="scss">
.da-timeline {
  .timeline-header {
    flex-wrap: nowrap;
    border-top-left-radius: 6px !important;
    border-top-right-radius: 6px !important;
    min-height: 32px;
  }
}

@media all and (max-width: 768px) {
  .da-timeline {
    .v-timeline-item__divider {
      display: none;
    }

    .v-timeline-item__body {
      max-width: 100%;
    }
  }
}
</style>
