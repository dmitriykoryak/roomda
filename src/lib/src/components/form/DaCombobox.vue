<template>
  <div>
    <div v-if="mini">
      <v-chip v-for="(val, i) in value" :key="i" class="ma-1">
        {{ val }}
      </v-chip>
    </div>
    <v-combobox
      v-else
      ref="combobox"
      :value="value"
      @change="
        $emit('input', $event)
        $refs.combobox.lazySearch = null
      "
      :items="items"
      :loading="loading"
      :label="label"
      :clearable="clearable"
      :outlined="outlined"
      :solo="solo"
      :flat="flat"
      :dense="dense"
      :errorMessages="errorMessages"
      :hide-details="hideDetails"
      :singleLine="singleLine"
      :fullWidth="fullWidth"
      :placeholder="placeholder"
      :hint="hint"
      multiple
      chips
      deletable-chips
      @update:search-input="fetchItems($event)"
    >
    </v-combobox>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: Array,
    attr: String,
    label: String,
    com: Object,
    errorMessages: String,
    clearable: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    singleLine: Boolean,
    hideDetails: Boolean,
    fullWidth: Boolean,
    placeholder: String,
    hint: String,
    outlined: Boolean,
    mini: Boolean,
    block: Boolean,
    apiUrl: String
  },
  data() {
    return {
      loading: false,
      items: []
    }
  },
  methods: {
    async fetchItems(searchValue) {
      if (!searchValue || searchValue.length < 1) return
      this.searchValue = searchValue

      this.loading = true
      const apiUrl =
        this.apiUrl ||
        this.$config.api.url[this.$config.service] + '/' + this.com.options.url
      const response = await this.query.get(apiUrl, {
        ...(this.com && this.com.options && this.com.options.get),
        [(this.com && this.com.options && this.com.options.attr) ||
        'label']: searchValue
      })
      this.loading = false
      this.items = []
      for (const [key, value] of Object.entries(response.data.data)) {
        this.items.push(value.label)
      }
    }
  },
  computed: mapGetters(['query'])
}
</script>

<style lang="scss" scoped></style>
