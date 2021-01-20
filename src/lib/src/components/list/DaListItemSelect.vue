<template>
  <v-list-item @click="clickOnSelect">
    <v-list-item-content>
      <v-list-item-subtitle>
        {{ label }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action class="d-flex justify-end">
      <da-preview-list
        :item="editedItem"
        :attr="attr"
        :mapKey="mapKey"
      ></da-preview-list>
    </v-list-item-action>

    <da-select
      class="d-none"
      ref="select"
      v-model="localValue"
      :attr="attr"
      :label="label"
      :depItem="editedItem"
      :apiUrl="apiUrl"
      :mapKey="mapKey"
      multiple
    ></da-select>
  </v-list-item>
</template>

<script>
export default {
  name: 'da-list-item-select',

  props: {
    attr: String,
    value: [Array, Object],
    editedItem: Object,
    mapKey: String,
    apiUrl: String,
    label: String
  },

  data: () => ({}),

  methods: {
    clickOnSelect() {
      const select = this.$refs.select.$el
      const selectSimple = select.querySelector('.da-select-simple')
      selectSimple.click()
    }
  },

  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
