<template>
  <div class="da-range-field d-flex align-center">
    <v-btn
      @click="
        localValue =
          typeof localValue === 'number' && localValue > 0 ? --localValue : 0
        $emit('click:minus')
      "
      :disabled="disabled"
      icon
    >
      <div v-if="noIcon" class="no-icon-minus">-</div>
      <v-icon v-else>remove</v-icon>
    </v-btn>
    <div>
      <v-text-field
        :value="value"
        @input="localValue = $event"
        class="mt-0 pt-0 mx-1"
        hide-details
        single-line
        v-mask="'##########'"
        :style="{ width: width + 'px' }"
        :outlined="outlined"
        :dense="dense"
        :disabled="disabled"
        type="tel"
      >
      </v-text-field>
    </div>
    <v-btn
      @click="
        localValue = typeof localValue === 'number' ? ++localValue : 0
        $emit('click:plus')
      "
      :disabled="disabled"
      icon
    >
      <div v-if="noIcon" class="no-icon-plus">+</div>
      <v-icon v-else>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
/**
 * Range field
 */
export default {
  name: 'da-range-field',

  data: () => ({}),

  props: {
    value: [String, Number],
    outlined: Boolean,
    dense: Boolean,
    width: {
      type: [String, Number],
      default: 80
    },
    max: Number,
    disabled: Boolean,
    noIcon: Boolean
  },

  computed: {
    localValue: {
      get() {
        return this.value ? parseInt(this.value) : this.value
      },
      set(val) {
        if (!this.max || (this.max && this.max >= val)) {
          this.$emit('input', val)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.da-range-field {
  input {
    text-align: right;
  }
  .no-icon-minus {
    font-size: 30px;
  }
  .no-icon-plus {
    font-size: 20px;
  }
}
</style>
