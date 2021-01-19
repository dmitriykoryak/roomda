<template>
  <h2
    class="mt-6 mb-3 font-weight-bold text-center"
    :class="$vuetify.breakpoint.smAndDown ? 'title' : 'headline'"
  >
    <slot></slot>
  </h2>
</template>
