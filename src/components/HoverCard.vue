<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="d-flex align-center justify-center flex-column"
      :width="$vuetify.breakpoint.smAndDown ? 160 : 220"
      :height="$vuetify.breakpoint.smAndDown ? 160 : 220"
      outlined
      :elevation="hover ? 4 : 0"
      :class="{
        'blue white--text': isSelected,
        'ma-1': $vuetify.breakpoint.smAndDown,
        'ma-4': $vuetify.breakpoint.smAndUp,
      }"
      @click="$emit('click:card')"
    >
      <v-icon
        :size="$vuetify.breakpoint.smAndDown ? 44 : 50"
        :dark="isSelected"
        >{{ item.icon }}</v-icon
      >
      <div class="mt-2 font-weight-bold">{{ item.label }}</div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      },
    },
    isSelected: Boolean,
  },
};
</script>

<style lang="scss" scoped></style>
