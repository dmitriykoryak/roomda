<template>
  <form v-bind="dynamicAttrs">
    <!--validator.errors-->
    <v-slide-x-reverse-transition v-if="!hideSumValidateErrors">
      <div class="mt-3 ml-3" v-if="scopeErrors && scopeErrors.length">
        <v-row v-for="(error, i) in scopeErrors" :key="i" no-gutters>
          <v-col class="error--text ml-3">
            {{ error.msg }}
          </v-col>
        </v-row>
      </div>
    </v-slide-x-reverse-transition>
    <!--validator.errors end-->

    <v-tabs v-if="isTabsShow" v-model="tabs" color="blue" show-arrows>
      <v-tab v-for="(group, tabName, index) in struc[scenario]" :key="index">
        {{ tabName }}
      </v-tab>

      <v-tab-item
        v-for="(group, attr, index) in struc[scenario]"
        :key="index"
        eager
      >
        <da-flds
          :iterable="group.items"
          :editedItem.sync="localEdItem"
          :labels="labels"
          :rules="rules"
          :scenario="scenario"
          :parentAttr="parentAttr"
          :mapKey="mapKey"
          :apiUrl="apiUrl"
          :parentId="parentId"
          :id="id"
          :coms="coms"
          :tooltips="tooltips"
          :showedFields="showedFields"
          :hiddenFields="hiddenFields"
          :hideGroups="hideGroups"
          :validationScope="validationScope"
          :noPadding="noPadding"
          :isFullWidth="isFullWidth"
          :outlined="outlined"
          :dense="dense"
          :isOne="isOne"
        ></da-flds>
      </v-tab-item>
    </v-tabs>

    <template
      v-else-if="
        struc[scenario] && !hideGroups && objDepth(struc[scenario]) > 1
      "
    >
      <div v-for="(group, i) in struc[scenario]" :key="i">
        <da-flds
          :iterable="group.items"
          :editedItem.sync="localEdItem"
          :labels="labels"
          :rules="rules"
          :scenario="scenario"
          :parentAttr="parentAttr"
          :mapKey="mapKey"
          :apiUrl="apiUrl"
          :parentId="parentId"
          :id="id"
          :coms="coms"
          :tooltips="tooltips"
          :showedFields="showedFields"
          :hiddenFields="hiddenFields"
          :hideGroups="hideGroups"
          :validationScope="validationScope"
          :noPadding="noPadding"
          :isFullWidth="isFullWidth"
          :outlined="outlined"
          :dense="dense"
          :isOne="isOne"
        ></da-flds>
      </div>
    </template>

    <da-flds
      v-else
      :iterable="strucDepth1"
      :editedItem.sync="localEdItem"
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
      :showedFields="showedFields"
      :hiddenFields="hiddenFields"
      :hideGroups="hideGroups"
      :validationScope="validationScope"
      :noPadding="noPadding"
      :isFullWidth="isFullWidth"
      :outlined="outlined"
      :dense="dense"
      :isOne="isOne"
    ></da-flds>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import DaFlds from '~~/components/form/field/_DaFlds.vue'

export default {
  name: 'da-fields',
  components: {
    DaFlds
  },

  inject: ['$validator'],

  data: () => ({
    tabs: 0
  }),

  props: {
    struc: {
      type: Object,
      default: () => {}
    },
    editedItem: {
      type: Object,
      default: () => {}
    },
    labels: Object,
    rules: Object,
    scenario: String,
    parentAttr: String,
    parentId: [Number, String],
    id: [Number, String],
    mapKey: String,
    apiUrl: String,
    coms: [Object, Array],
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
    hideTabs: Boolean,
    hideGroups: Boolean,
    validationScope: String,
    noPadding: Boolean,
    hideSumValidateErrors: Boolean,
    // scroll to validate error trigger
    scrollTrigger: Boolean,
    isFullWidth: Boolean,
    outlined: Boolean,
    dense: Boolean,
    isOne: Boolean
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
    scopeErrors() {
      return this.errors.items.length
        ? this.errors.items.filter(e => e.scope === this.validationScope)
        : []
    },
    dynamicAttrs() {
      let out = {}
      if (this.validationScope) {
        out = { ...out, 'data-vv-scope': this.validationScope }
      }
      return out
    },
    /**
     * Преобразовать struc[scenario] в object с глубиной вложенности === 1
     * @return {object}
     */
    strucDepth1() {
      let out = {}
      let struc = this.struc[this.scenario]
      const strucDepth = this.objDepth(struc)

      if (strucDepth === 1) {
        return struc
      } else if (strucDepth === 5) {
        for (let [tabName, str] of Object.entries(struc)) {
          for (let [attr, val] of Object.entries(str.items)) {
            if (typeof val === 'object') {
              out = { ...out, ...val.items }
            } else {
              out = { ...out, [attr]: val }
            }
          }
        }
      } else {
        for (let [groupName, st] of Object.entries(struc)) {
          out = { ...out, ...st.items }
        }
      }
      return out
    },

    isTabsShow() {
      return (
        !this.hideTabs &&
        this.struc[this.scenario] &&
        this.objDepth(this.struc[this.scenario]) > 2 &&
        this.objSize(this.struc[this.scenario]) > 1
      )
    },
    ...mapGetters(['objDepth', 'objSize', 'scrollToError'])
  },

  watch: {
    // по срабатыванию тригера в true - перключить на tab с ошибкой и прокрутить документ до ошибки валидации
    scrollTrigger(val) {
      if (val) {
        if (!this.scrollToError(this)) {
          const firstErrorAttr = this.errors.items[0].field

          let tabIndex = -1
          let skipNextTabs = false
          for (let [tabLabel, value] of Object.entries(
            this.struc[this.scenario]
          )) {
            if (skipNextTabs) continue

            for (let [attr, val] of Object.entries(value.items)) {
              if (this._.isObject(val)) {
                for (let [at, v] of Object.entries(val.items)) {
                  if (firstErrorAttr === at) {
                    skipNextTabs = true
                  }
                }
              } else {
                if (firstErrorAttr === attr) {
                  skipNextTabs = true
                }
              }
            }
            tabIndex++
          }
          if (tabIndex !== -1) {
            this.tabs = tabIndex
            // время перехода таба
            setTimeout(() => this.scrollToError(this), 300)
          }
        }
        this.$emit('update:scrollTrigger', false)
      }
    }
  }
}
</script>

<style lang="scss"></style>
