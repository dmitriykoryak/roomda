<template>
  <div>
    <slot name="items" v-bind="{ items }">
      <v-row>
        <v-col
          v-for="(item, index) in items"
          :key="index"
          cols="12"
          :sm="sm"
          :md="md"
          :lg="lg"
        >
          <slot name="item" v-bind="{ item, index }"> </slot>
        </v-col>
      </v-row>
    </slot>
    <div class="d-flex justify-end caption grey--text text--darken-2">
      <div>{{ `1-${items.length} из ${serverItemsLength}` }}</div>
    </div>
    <v-btn
      v-if="serverItemsLength > items.length"
      depressed
      block
      color="primary"
      class="my-3"
      :loading="loading"
      @click="
        page++
        $emit('pagination', { page, itemsPerPage })
      "
      >Показать еще</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    itemsPerPage: {
      type: Number,
      default: 10
    },
    serverItemsLength: Number,
    sm: {
      type: [String, Number],
      default: 6
    },
    md: {
      type: [String, Number],
      default: 4
    },
    lg: {
      type: [String, Number],
      default: 3
    },
    loading: Boolean
  },
  data() {
    return {
      page: 1
    }
  }
}
</script>

<style lang="scss" scoped></style>
