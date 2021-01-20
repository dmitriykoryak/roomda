<template>
  <div
    class="da-switch js-no-row-actions-trigger"
    :class="{ 'dense-top': denseTop }"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          v-if="iconMode"
          v-on="config ? on : ''"
          :class="classObj"
          @click="localValue = !localValue"
          >{{ icon }}
        </v-icon>
        <div v-else v-on="config ? on : ''">
          <v-switch
            :input-value="invert ? !value : value"
            :disabled="disabled"
            :label="label"
            @change="localValue = !localValue"
            :hide-details="hideDetals"
            :error-messages="errorMessages"
            :dense="dense"
            inset
            :class="{ 'mt-0': singleLine }"
          >
          </v-switch>
        </div>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
  </div>
</template>

<script>
/**
 * Toggle переключатель
 */
export default {
  name: 'da-switch',

  data: () => ({}),

  props: {
    attr: String,
    scenario: String,
    value: Boolean,
    tooltips: Object,
    //редактируемый ли компонент
    disabled: {
      type: Boolean,
      default: false
    },
    // Показывать ли состояние off если компонент disabled = true
    showIfDisabled: {
      type: Boolean,
      default: true
    },
    // вид иконки
    iconMode: Boolean,
    dense: Boolean,
    singleLine: Boolean,
    denseTop: Boolean,
    hideDetals: Boolean,
    label: String,
    errorMessages: String,
    saveFunc: Function
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
    config() {
      if (this.tooltips) {
        return this.tooltips[this.attr]
      }
    },
    classObj() {
      if (this.disabled) {
        return {}
      }

      if (this.invert) {
        return this.localValue ? 'pink--text' : 'green--text'
      } else {
        return this.localValue ? 'green--text' : 'pink--text'
      }
    },
    invert() {
      return (this.config && this.config[0].on) || false
    },
    icon() {
      if (this.invert) {
        return this.localValue ? this.offIcon : this.onIcon
      } else {
        return this.localValue ? this.onIcon : this.offIcon
      }
    },
    showOff() {
      return (this.showIfDisabled && this.disabled) || !this.disabled
    },
    onIcon() {
      return 'fa fa-check'
    },
    offIcon() {
      return this.showOff ? 'fa fa-times' : ''
    },
    title() {
      if (this.config) {
        return this.localValue ? this.config[1].title : this.config[0].title
      }
    }
  }
}
</script>

<style lang="scss">
.da-switch {
  &.dense-top .v-input--selection-controls {
    margin-top: 0;
  }
}
</style>
