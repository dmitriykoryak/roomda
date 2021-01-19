<template>
  <da-select
    v-model="itemsIds"
    :attr="attr"
    :label="label"
    :apiUrl="$config.api.url.crm"
    :depItem="editedItem"
    :prependIcon="prependIcon"
    :mapKey="mapKey"
    :clearable="clearable"
    multiple
  ></da-select>
</template>

<script>
/**
 * DaGridSelect
 * работает c таблицей Grid
 * т.е. при клике на option делает запрос на API для (add, delete строки в Grid)
 */
import { mapGetters } from 'vuex'

export default {
  name: 'da-grid-select',

  mounted() {
    this.init()
  },

  data: () => ({
    items: [],
    itemsIds: [],
    //Блокировка запросов на изменения items - необходима при инициации компонента(ввода начальных значений)
    lockItems: true
  }),

  props: {
    attr: String,
    mapKey: String,
    label: String,
    apiUrl: String,
    apiPath: String,
    prependIcon: String,
    editedItem: Object,
    clearable: Boolean,
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    async init() {
      await this.getItems()
      // unlock Items
      setTimeout(() => (this.lockItems = false), 1000)
    },

    async getItems() {
      const response = await this.query.get(
        this.$config.api.url.crm + '/' + this.apiPath,
        null,
        this.loading,
        false
      )
      this.items = response.data.data
      this.itemsIds = this.items.map(i => i[this.attr])
    },

    /**
     * Найти ID в Grid по ID атрибута
     * */
    findGridId(attrId) {
      const item = this.items.find(i => i[this.attr] === attrId)
      return item.id
    }
  },

  computed: {
    ...mapGetters(['query'])
  },

  watch: {
    /**
     * Наблюдение за изменениями в itemsIds и запрос на API для изменения
     */
    itemsIds: {
      handler(newVal, oldVal) {
        if (this.lockItems) return

        let addIds = new Set()
        let removeIds = new Set()
        if (newVal.length !== oldVal.length) {
          // найти массив ID для добавления
          newVal.forEach(newId => {
            if (!oldVal.includes(newId)) {
              addIds.add(newId)
            }
          })
          // найти массив ID для удаления
          oldVal.forEach(oldId => {
            if (!newVal.includes(oldId)) {
              removeIds.add(oldId)
            }
          })

          ;[...addIds].forEach(async id => {
            const response = await this.query
              .post(
                this.$config.api.url.crm + '/' + this.apiPath + '/create',
                { shift_id: id },
                true
              )
              .catch(e => {
                // если не прошло добавление - удалить id из массива
                const index = this.itemsIds.findIndex(i => i.id === id)
                this.itemsIds.splice(index, 1)
              })
            this.items.push(response.data.data)
          })
          ;[...removeIds].forEach(async id => {
            await this.query
              .delete(
                this.$config.api.url.crm +
                  '/' +
                  this.apiPath +
                  '/' +
                  this.findGridId(id),
                null,
                true
              )
              .catch(e => {
                this.itemsIds.push(id) // если не прошло удаление - добавить id обратно в массив
              })
          })

          this.items = this.items.filter(item => {
            if (newVal.includes(item[this.attr])) {
              return true
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss"></style>
