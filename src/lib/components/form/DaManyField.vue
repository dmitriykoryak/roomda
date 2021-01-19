<template>
  <div>
    <!--Если поле множественное-->
    <template v-if="isMany">
      <div class="error--text">{{ errors && errors.first(attrWithScope) }}</div>
      <div
        class="d-flex align-center"
        v-for="(clone, index) in localValue.length || 1"
        :key="index"
      >
        <v-text-field
          v-if="mask"
          :value="localValue[index]"
          v-validate="curRule"
          :name="attr"
          @input="updateMany(index, $event)"
          :label="label"
          :type="type"
          :placeholder="placeholder"
          :outlined="outlined"
          :dense="dense"
          v-mask="mask"
          @blur="$emit('blur')"
        ></v-text-field>
        <component
          v-else
          :is="com.com"
          :value="localValue[index]"
          v-validate="curRule"
          :name="attr"
          @input="updateMany(index, $event)"
          :label="label"
          :type="type"
          :placeholder="placeholder"
          :outlined="outlined"
          :dense="dense"
          :clearable="clearable"
          :auto-grow="autoGrow"
          :rows="rows"
          :row-height="rowHeight"
          :attr="attr"
          :multiple="multiple"
          :mapKey="mapKey"
          :apiUrl="apiUrl"
          :parentAttr="parentAttr"
          :parentId="parentId"
          :id="id"
          :editedItem="editedItem"
          :scenario="scenario"
          :tooltips="tooltips"
          :isOne="isOne"
          :com="com"
          editable
          @blur="$emit('blur')"
        ></component>
        <v-btn
          icon
          smalls
          class="ml-1 fw-many-btn"
          :class="
            (index === 0 ? 'da-btn-add' : 'da-btn-remove') +
              (outlined ? ' outlined-center-correction' : '')
          "
          @click="index === 0 ? addField() : delField(index)"
        >
          <v-icon>
            {{ index === 0 ? 'add' : 'remove' }}
          </v-icon>
        </v-btn>
      </div>
    </template>
    <!--Если поле множественное конец-->

    <!--Если поле одиночное-->
    <template v-else>
      <v-text-field
        v-if="mask"
        :value="localValue"
        v-validate="curRule"
        :name="attr"
        :error-messages="errors && errors.first(attrWithScope)"
        @input="$emit('input', $event)"
        :label="label"
        :placeholder="placeholder"
        :outlined="outlined"
        :dense="dense"
        v-mask="mask"
        @blur="$emit('blur')"
      ></v-text-field>
      <component
        v-else
        :is="com.com"
        :value="localValue"
        v-validate="curRule"
        :name="attr"
        :error-messages="errors && errors.first(attrWithScope)"
        @input="$emit('input', $event)"
        :label="label"
        :type="type"
        :placeholder="placeholder"
        :outlined="outlined"
        :dense="dense"
        :clearable="clearable"
        :auto-grow="autoGrow"
        :rows="rows"
        :row-height="rowHeight"
        :attr="attr"
        :multiple="multiple"
        :mapKey="mapKey"
        :apiUrl="apiUrl"
        :parentAttr="parentAttr"
        :parentId="parentId"
        :id="id"
        :editedItem="editedItem"
        :scenario="scenario"
        :tooltips="tooltips"
        :isOne="isOne"
        :com="com"
        editable
        @blur="$emit('blur')"
      ></component>
    </template>
    <!--Если поле одиночное конец-->
  </div>
</template>

<script>
import { VTextarea } from 'vuetify/lib'

export default {
  name: 'da-many-field',

  inject: ['$validator'],

  components: { VTextarea },

  data: () => ({}),

  props: {
    value: [String, Number, Boolean, Array, Object],
    label: String,
    errorMessages: String,
    attr: String,
    type: {
      type: String,
      default: 'input'
    },
    placeholder: String,
    clearable: Boolean,
    mask: String,
    com: {
      type: Object,
      default: () => {
        return {
          com: 'v-text-field'
        }
      }
    },
    tooltips: Object,
    'auto-grow': Boolean,
    rows: Number,
    'row-height': Number,
    region: String,
    cityId: Number,
    multiple: Boolean,
    mapKey: String,
    apiUrl: String,
    parentAttr: String,
    parentId: [Number, String],
    id: [Number, String],
    editedItem: Object,
    scenario: {
      type: String,
      default: 'search'
    },
    rules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    validationScope: String,
    outlined: Boolean,
    dense: Boolean,
    // Одновременно 1 фаил в DaUploader
    isOne: Boolean,
    many: Boolean
  },

  methods: {
    test(e) {
      console.log(e)
    },
    addField() {
      let clone = [...this.localValue]
      clone.push('')
      this.$emit('input', clone)
    },
    delField(index) {
      let clone = [...this.localValue]
      clone.splice(index, 1)
      this.$emit('input', clone)
    },
    updateMany(index, val) {
      let clone = [...this.localValue]
      clone[index] = val
      this.$emit('input', clone)
    }
  },

  computed: {
    localValue() {
      if (this.isMany && !this.value) {
        return ['']
      }
      return this.value
    },
    isMany() {
      return this.many || this.curRule.includes('many')
    },
    attrWithScope() {
      return this.validationScope
        ? this.validationScope + '.' + this.attr
        : this.attr
    },
    /**
     * Правила валидации для field
     * */
    curRule() {
      return (
        (this.rules[this.scenario] && this.rules[this.scenario][this.attr]) ||
        ''
      )
    }
  }
}
</script>

<style scoped lang="scss">
.outlined-center-correction {
  margin-top: -26px;
}
</style>
