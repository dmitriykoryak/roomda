<template>
  <h1
    class="font-weight-bold"
    :class="$vuetify.breakpoint.mdAndUp ? 'display-1' : 'title'"
  >
    <slot></slot>
  </h1>
</template>
