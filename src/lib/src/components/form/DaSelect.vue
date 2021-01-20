<template>
  <da-select-simple
    class="da-select"
    v-model="localValue"
    :items="items"
    :label="label"
    :prepend-icon="prependIcon"
    :no-data-text="noDataText"
    :multiple="multiple"
    :loading="loading"
    :error-messages="errorMessages"
    :hint="hint"
    :dense="dense"
    :solo="solo"
    :flat="flat"
    :single-line="singleLine"
    :hideDetails="hideDetails"
    :attr="attr"
    :clearable="clearable"
    :outlined="outlined"
    :placeholder="placeholder"
    :disabled="disabled"
    :search="search"
    :modalOff="modalOff"
    :with-colors="withColors"
    :full-width="fullWidth"
    @blur="$emit('blur')"
    @click:clear="$emit('click:clear')"
  >
    <template v-if="withColors" v-slot:selection="{ item }">
      <div class="d-flex align-center flex-nowrap">
        <div
          v-if="item.color"
          class="select-item-color mr-4 my-1"
          :style="{ backgroundColor: item.color }"
        ></div>
        <div>
          {{ item.text }}
        </div>
      </div>
    </template>

    <template v-if="withColors" v-slot:item="{ item }">
      <v-list-item-avatar class="select-item-color-wrap">
        <div
          class="select-item-color"
          :style="{ backgroundColor: item.color }"
        ></div>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </da-select-simple>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DaSelectSimple from '~~/components/form/DaSelectSimple.vue'

export default {
  name: 'da-select',
  components: {
    DaSelectSimple
  },
  mounted() {
    this.fillItems()
  },
  data: () => ({
    noDataText: 'Нет данных',
    items: [],
    loading: false,
    // Если пришли от api цвета, то флаг withColors = true и показать в select
    withColors: false
  }),
  props: {
    value: [String, Number, Array, Object],
    attr: String,
    label: String,
    apiUrl: String,
    mapKey: String,
    prependIcon: String,
    multiple: Boolean,
    depDropParams: Object,
    editedItem: Object,
    errorMessages: String,
    hint: String,
    clearable: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    singleLine: Boolean,
    hideDetails: Boolean,
    fullWidth: Boolean,
    mapKey: String,
    placeholder: String,
    disabled: Boolean,
    outlined: Boolean,
    search: Boolean,
    modalOff: Boolean
  },
  methods: {
    async fetchList() {
      await this.$store.dispatch('fetchList', {
        mapKey: this.mapKey,
        apiUrl: this.apiUrl,
        attr: this.attr,
        item: this.editedItem
      })
    },

    fillItems() {
      if (!this.list) return

      this.items = []
      if (this.objDepth(this.list.items) > 2) {
        // если вложенный
        for (let [key, items] of Object.entries(this.list.items)) {
          // if (this.items.length) {
          // 	this.items.push({divider: true});
          // }

          if (typeof items.items === 'object') {
            this.items.push({ header: items.label })
            for (let [value, data] of Object.entries(items.items)) {
              const item = {
                text: data.label,
                value: this.isNumeric(value) ? parseInt(value) : value,
                color: data.color
              }
              if (data.color) {
                this.withColors = true
              }
              this.items.push(item)
            }
          } else {
            const itm = {
              text: items.label,
              value: this.isNumeric(key) ? parseInt(key) : key,
              color: items.color
            }
            if (items.color) {
              this.withColors = true
            }
            this.items.push(itm)
          }
        }
      } else {
        for (let [value, data] of Object.entries(this.list.items)) {
          const item = {
            text: data.label,
            value: this.isNumeric(value) ? parseInt(value) : value,
            color: data.color
          }
          if (data.color) {
            this.withColors = true
          }
          this.items.push(item)
        }
      }
      this.loading = false
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    depValues() {
      let values = []
      if (this.editedItem) {
        for (let [attr, val] of Object.entries(this.editedItem)) {
          if (this.depAttrs.includes(attr)) {
            values.push(val)
          }
        }
      }

      return values
    },
    ...mapState({
      localData: state => state.GridState.data,
      depends: state => state.GridState.depends,
      list(state) {
        return this.getList(this.mapKey, this.attr, this.editedItem)
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
            listsInSet[this.attr] &&
            listsInSet[this.attr]['get-depends'] &&
            Object.keys(listsInSet[this.attr]['get-depends'])) ||
          []
        )
      }
    }),
    ...mapGetters([
      'objDepth',
      'getKeyByValue',
      'isNumeric',
      'arrCompare',
      'listsInSet',
      'getList'
    ])
  },
  watch: {
    depValues: {
      handler(newVal, oldVal) {
        if (newVal.length && !this.arrCompare(newVal, oldVal)) {
          this.fetchList()
        }
      },
      deep: true
    },
    list: {
      handler() {
        this.fillItems()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.select-item-color-wrap {
  justify-content: flex-start;
}

.select-item-color {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 2px;
}
</style>
