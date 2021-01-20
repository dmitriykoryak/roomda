<template>
  <div>
    <template v-if="mini">
      {{ localValue }}
    </template>
    <v-combobox
      v-else
      :value="localValue"
      @input="
        localValue = $event
        isSearch = false
      "
      @update:search-input="search($event)"
      @click:clear="streetsData = []"
      @blur="
        isSearch = false
        blurAfterTimeout()
      "
      placeholder="Введите значение для поиска"
      :error-messages="errorMessages"
      :items="streets"
      :loading="loading"
      :label="label"
      clearable
      hide-no-data
    >
    </v-combobox>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'da-location-street',

  inject: ['$validator'],

  data: () => ({
    loading: false,
    searchTimer: null,
    isSearchTimer: null,
    streetsData: [],
    isSearch: true,
    cityId: null
  }),

  props: {
    value: String,
    editedItem: Object,
    attr: String,
    mapKey: String,
    errorMessages: String,
    label: String,
    mini: Boolean
  },

  methods: {
    /**
     * Провалидировать после задержки - потому как при обычном вводе в input field - валидатор не успевает получить значение поля
     * */
    blurAfterTimeout() {
      setTimeout(() => this.$emit('blur'), 100)
    },
    async search(searchValue) {
      if (!searchValue || !this.isSearch || !this.editedItem[this.cityAttr])
        return

      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(async () => {
        const params = {
          cityIds: this.editedItem[this.cityAttr],
          cityId: this.editedItem[this.cityAttr],
          search: searchValue,
          limit: 10
        }
        this.loading = true
        const response = await this.query
          .get(
            this.protocol + '//fias.api.bshost.ru/streetincities',
            params,
            false
          )
          .catch(() => {
            this.loading = false
          })
        this.loading = false
        this.streetsData =
          (response.data.data && response.data.data.items) || []
      }, 1000) // Запрос только спустя 1с после окончания ввода в поле поиска
    },

    clearStreets() {
      this.streetsData.splice(0, this.streetsData.length)
    }
  },
  computed: {
    localValue: {
      get() {
        if (this.value && !this.streetsData.includes(this.value)) {
          this.streetsData.push({ offname: this.value })
          this.isSearch = false
        }
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    streets() {
      return (
        this.streetsData &&
        this.streetsData.map(street => {
          return street.offname
        })
      )
    },
    /**
     * Найти зависимые attr
     * @param state
     * @return {*}
     */
    depAttrs(state) {
      const listsInSet = this.listsInSet(this.mapKey)
      return (
        (listsInSet &&
          this.listsInSet[this.attr] &&
          this.listsInSet[this.attr]['get-depends'] &&
          Object.keys(listsInSet[this.attr]['get-depends'])) ||
        []
      )
    },
    cityAttr() {
      return this.depAttrs[0]
    },
    ...mapGetters([
      'query',
      'arrCompare',
      'validateField',
      'listsInSet',
      'protocol'
    ])
  },

  watch: {
    isSearch(val) {
      if (val) return

      clearTimeout(this.isSearchTimer)
      this.isSearchTimer = setTimeout(() => (this.isSearch = true), 500)
    },

    editedItem: {
      handler() {
        this.cityId = this.editedItem[this.cityAttr]
      },
      deep: true
    },

    cityId() {
      this.clearStreets()
    }
  }
}
</script>

<style scoped lang="scss"></style>
