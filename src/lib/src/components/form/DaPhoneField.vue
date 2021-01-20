<template>
  <vue-tel-input-vuetify
    :placeholder="placeholder"
    :value="value ? value.toString() : null"
    @input="$emit('input', $event)"
    :error-messages="errorMessages"
    :label="label"
    :prepend-icon="prependIcon"
    :clearable="clearable"
    :outlined="outlined"
    :readonly="readonly"
    :disabled="disabled"
    :dense="dense"
    type="tel"
    @blur="$emit('blur', $event)"
    @keyup="$emit('keyup', $event)"
  ></vue-tel-input-vuetify>
</template>

<script>
export default {
  name: 'da-phone-field',

  data: () => ({
    placeholder: ''
  }),

  props: {
    value: [String, Number],
    label: String,
    clearable: Boolean,
    errorMessages: String,
    prependIcon: String,
    outlined: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    dense: Boolean
  }
}
</script>
