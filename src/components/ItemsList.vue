<template>
  <div>
    <h2 class="mb-3">{{ title }}</h2>

    <v-row dense>
      <v-col v-for="(item, i) in items" :key="i" :cols="12" :sm="md">
        <a @click="item.clickFunc()" class="d-flex my-1">
          {{ item.label }}
          <span class="grey--text ml-2">{{ item.num }}</span>
        </a>
        <hr
          style="border-top: none; border-color: #EEE"
          class="mt-3 d-flex d-sm-none"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    md: {
      type: Number,
      default: function() {
        return 12;
      },
    },
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
