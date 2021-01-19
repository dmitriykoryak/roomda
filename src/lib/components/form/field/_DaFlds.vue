<template>
  <v-container class="max-w-100 da-fields" :class="{ 'pa-0': noPadding }">
    <v-row>
      <template v-for="(iter, groupName, ind) in iterable">
        <v-col
          v-if="
            !hideGroups &&
              iter &&
              typeof iter === 'object' &&
              ((showedFields.length &&
                groupNotEmpty(Object.keys(iter.items))) ||
                !showedFields.length)
          "
          cols="12"
          class="group-container"
        >
          <v-card
            tile
            outlined
            class="mb-2 max-w-100"
            :ref="iter.is_many ? manyClass : ''"
          >
            <v-card-text class="pr-0">
              <div class="d-flex justify-space-between align-center mb-3">
                <div class="text-uppercase">
                  {{ groupName }}
                </div>
                <div class="flex-grow-1"></div>
                <div class="d-flex ml-1" v-if="iter.is_many">
                  <v-btn icon @click="manyRemove(ind)">
                    <v-icon>
                      remove
                    </v-icon>
                  </v-btn>
                  <v-btn icon @click="manyAdd(ind)">
                    <v-icon>
                      add
                    </v-icon>
                  </v-btn>
                </div>
              </div>

              <div :class="{ [manyClass + '-' + ind]: iter.is_many }">
                <v-row style="width: 100%">
                  <template v-for="(item, at, index) in iter.items">
                    <da-field
                      v-if="isShowField(at)"
                      :editedItem.sync="localEdItem"
                      :attr="at"
                      :labels="labels"
                      :rules="rules"
                      :scenario="scenario"
                      :parentAttr="parentAttr"
                      :parentId="parentId"
                      :id="id"
                      :mapKey="mapKey"
                      :apiUrl="apiUrl"
                      :coms="coms"
                      :tooltips="tooltips"
                      :_isMany="iter.is_many"
                      :key="index"
                      :validationScope="validationScope"
                      :isFullWidth="isFullWidth"
                      :outlined="outlined"
                      :dense="dense"
                      :isOne="isOne"
                    ></da-field>
                  </template>
                </v-row>

                <div
                  v-if="iter.is_many"
                  class="d-flex d-md-none justify-space-between"
                >
                  <v-icon class="green--text">arrow_left</v-icon>
                  <v-icon class="green--text">arrow_right</v-icon>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <da-field
          v-else-if="isShowField(groupName)"
          :editedItem.sync="localEdItem"
          :attr="groupName"
          :labels="labels"
          :rules="rules"
          :scenario="scenario"
          :parentAttr="parentAttr"
          :parentId="parentId"
          :id="id"
          :mapKey="mapKey"
          :apiUrl="apiUrl"
          :coms="coms"
          :tooltips="tooltips"
          :validationScope="validationScope"
          :isFullWidth="isFullWidth"
          :outlined="outlined"
          :dense="dense"
          :isOne="isOne"
        >
        </da-field>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import DaField from '~~/components/form/field/DaField.vue'

export default {
  name: 'da-flds',
  components: {
    DaField
  },
  mounted() {
    //@todo работает но костыль - переделать
    setTimeout(() => this.calcClones(), 1000)
    this.randNum = this.randTs()
  },
  data: () => ({
    clones: 0,
    randNum: 0
  }),
  props: {
    iterable: [Array, Object],
    editedItem: Object,
    labels: Object,
    rules: Object,
    scenario: String,
    parentAttr: String,
    parentId: [Number, String],
    id: [Number, String],
    mapKey: String,
    apiUrl: String,
    coms: [Array, Object],
    tooltips: Object,
    // если задан массив showedFields - покажет только присутствующие в нем атрибуты
    showedFields: {
      default: () => [],
      type: Array
    },
    // скрыть атрибуты []
    hiddenFields: {
      default: () => [],
      type: Array
    },
    hideGroups: Boolean,
    validationScope: String,
    noPadding: Boolean,
    isFullWidth: Boolean,
    outlined: Boolean,
    dense: Boolean,
    isOne: Boolean
  },
  methods: {
    calcClones() {
      if (!this.iterable) return

      for (let [attr, iter] of Object.entries(this.iterable)) {
        if (iter.is_many) {
          const firstAttr = Object.keys(iter.items)[0]
          const values = this.localEdItem[firstAttr]
          if (values && values.length) {
            this.clones = values.length - 1
          }
        }
      }
    },
    manyAdd(index) {
      const wrap = document.getElementsByClassName(
        'many-wrapper-' + this.randNum + '-' + index
      )[0]
      const hiddenBtns = wrap.querySelectorAll('.da-btn-add')
      hiddenBtns.forEach(btn => btn.click())
      this.clones++
    },
    manyRemove(index) {
      const wrap = document.getElementsByClassName(
        'many-wrapper-' + this.randNum + '-' + index
      )[0]
      const cols = wrap.querySelectorAll('.js-for-many')
      cols.forEach(col => {
        const hiddenBtns = col.querySelectorAll('.da-btn-remove')
        const btn = hiddenBtns[hiddenBtns.length - 1]
        if (btn) {
          btn.click()
        }
      })
      this.clones--
    },
    /**
     * Проверить есть ли в массиве (hiddenFields, showedFields) атрибуты attrs[]
     * @param arr
     * @param attrs
     * @return {boolean}
     */
    arrHasAttrs(arr, attrs) {
      for (let attr in attrs) {
        if (arr.includes(attr)) {
          return true
        }
      }
      return false
    },

    /**
     * Показывать ли поле
     * Показать поле если оно есть в showedFields или
     * если showedFields - пустой и его нет в hiddenFields
     * @return {default.computed.curRule|(function(): (*|Array))|*|(function(*): boolean)|boolean}
     */
    isShowField(attr) {
      return (
        attr !== this.parentAttr &&
        // this.fieldDirective(this.localEdItem[attr]) &&
        ((this.showedFields.length && this.showedFields.includes(attr)) ||
          (!this.showedFields.length && !this.hiddenFields.includes(attr)))
      )
    },

    /**
     * Вернуть true если в ней есть хотя бы одно поле которое подлежит отображению
     * @param attrs
     * @return {boolean}
     */
    groupNotEmpty(attrs) {
      let show = true
      if (this.showedFields) {
        show = false
        attrs.forEach(attr => {
          if (this.showedFields.includes(attr)) {
            show = true
          }
        })
      }
      return show
    }
  },
  computed: {
    localEdItem: {
      get() {
        return this.editedItem
      },
      set(val) {
        this.$emit('update:editedItem', val)
      }
    },
    /**
     * Правила валидации для текущего сценария
     * */
    curRule() {
      return this.rules[this.scenario] || []
    },
    manyClass() {
      return 'many-wrapper many-wrapper-' + this.randNum
    },
    ...mapGetters(['fieldDirective', 'randTs'])
  }
}
</script>

<style lang="scss">
.da-fields {
  .many-wrapper {
    & > .row {
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .fw-many-btn {
      display: none;
    }
  }

  .group-container {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
