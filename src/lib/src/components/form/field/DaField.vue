<template>
  <v-col
    :cols="cols"
    :md="fullWidth ? 12 : 4"
    class="py-0 js-for-many"
    :class="{ 'mb-2': fullWidth }"
  >
    <da-many-field
      v-show="showTextField"
      @input="setVal(attr, $event)"
      v-bind="bindValues"
    ></da-many-field>
  </v-col>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'da-field',

  data: () => ({}),

  props: {
    editedItem: Object,
    labels: Object,
    rules: Object,
    scenario: String,
    parentAttr: String,
    parentId: [Number, String],
    id: [Number, String],
    mapKey: String,
    apiUrl: String,
    attr: String,
    coms: [Object, Array],
    tooltips: Object,
    validationScope: String,
    _isMany: Boolean,
    isFullWidth: Boolean,
    outlined: Boolean,
    dense: Boolean,
    isOne: Boolean
  },

  methods: {
    setVal(attr, val) {
      Vue.set(this.localEdItem, attr, val)
    },
    /**
     * Получить DepDrop Params
     * */
    getDepDropParams(attr, val) {
      let out = { [attr]: val }
      if (this.parentAttr) {
        out = { ...out, [this.parentAttr]: this.parentId }
      }
      if (this.id) {
        out = { ...out, id: this.id }
      }
      return out
    },
    /**
     * Добавить звездочку в обязательное поле
     * */
    getStar(rule) {
      if (/required/.test(rule)) {
        return ' *'
      } else {
        return ''
      }
    },

    isObject(iter, attr) {
      return typeof iter === 'object'
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
    allBindValues() {
      return {
        value: this.localEdItem[this.attr],
        attr: this.attr,
        scenario: this.scenario,
        rules: this.rules,
        outlined: this.outlined,
        dense: this.dense,
        clearable: true,
        validationScope: this.validationScope,
        label: this.labels[this.attr] + this.getStar(this.curRule)
      }
    },
    bindValues() {
      let out = { ...this.allBindValues }

      if (/boolean/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'da-switch' },
          dense: false,
          class: this.outlined ? 'mt-n5' : '',
          tooltips: this.tooltips
        }
      } else if (this.coms[this.attr]) {
        out = {
          ...out,
          mapKey: this.mapKey,
          editedItem: this.localEdItem,
          com: this.coms[this.attr],
          parentAttr: this.parentAttr,
          parentId: this.parentId,
          id: this.id,
          isOne: this.isOne
        }
      } else if (/dt_range/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'date-picker' },
          clearable: true,
          prependIcon: 'fa-calendar-alt',
          multiple: true
        }
      } else if (/dt/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'date-time-picker' },
          clearable: true,
          prependIcon: 'fa-calendar-alt'
        }
      } else if (/date/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'date-picker' },
          clearable: true,
          prependIcon: 'fa-calendar-alt'
        }
      } else if (/phone/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'da-phone-field' },
          clearable: true
        }
      } else if (/time/.test(this.curRule)) {
        out = {
          ...out,
          type: 'time'
        }
      } else if (/year/.test(this.curRule)) {
        out = {
          ...out,
          placeholder: '2000',
          mask: '####',
          clearable: true
        }
      } else if (/text/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'v-textarea' },
          autoGrow: true,
          rows: this.outlined ? 5 : 1,
          rowHeight: 15,
          clearable: true
        }
      } else if (/html/.test(this.curRule)) {
        out = {
          ...out,
          com: { com: 'da-editor' }
        }
      } else if (this.isList(this.mapKey, this.attr)) {
        out = {
          ...out,
          mapKey: this.mapKey,
          apiUrl: this.apiUrl,
          com: { com: 'da-select' },
          editedItem: this.localEdItem,
          multiple: /each/.test(this.curRule),
          depDropParams: this.getDepDropParams(
            this.attr,
            this.localEdItem[this.attr]
          )
        }
      } else if (/color/.test(this.curRule)) {
        out = {
          ...out,
          class: 'ma-2',
          com: { com: 'da-color-picker' }
        }
      }
      return out
    },
    /**
     * Правила валидации для текущего сценария и атрибута
     * */
    curRule() {
      return (
        (this.rules[this.scenario] && this.rules[this.scenario][this.attr]) ||
        []
      )
    },
    /**
     * Показывать ли текстовое поле
     * return true - показывать если:
     * attr !== parentAttr или если attr равен id и он есть в Текущих правилах валидации
     * @return {boolean|*}
     */
    showTextField() {
      return (
        this.attr !== this.parentAttr &&
        (this.attr !== 'id' ||
          (this.attr === 'id' && this.rules[this.scenario]['id']))
      )
    },
    fullWidth() {
      if (this.isFullWidth) {
        return true
      }
      const comName = this.coms[this.attr] && this.coms[this.attr].com
      return (
        comName === 'da-uploader' ||
        comName === 'da-video' ||
        comName === 'da-personcrm-info' ||
        comName === 'da-personauth-info' ||
        comName === 'da-pay' ||
        comName === 'da-task' ||
        /text|html/.test(this.curRule)
      )
    },
    cols() {
      return this._isMany ? 8 : 12
    },
    ...mapGetters(['isList'])
  }
}
</script>

<style lang="scss"></style>
