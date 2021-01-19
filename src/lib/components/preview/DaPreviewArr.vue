<template>
  <span>
    <v-tooltip v-if="value.length > 1" bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">{{ applyFilter(value[0]) }}</span>
      </template>
      <span v-for="val in value">
        <template v-if="val">
          <v-icon dark small left>{{ icon }}</v-icon>
          {{ applyFilter(val) }}
          <br />
        </template>
      </span>
    </v-tooltip>

    <template v-else-if="value.length === 1">
      {{ applyFilter(value[0]) }}
    </template>

    <template v-else> </template>
  </span>
</template>

<script>
/**
 * Компонент для предпросмотра массива
 */
export default {
  name: 'da-preview-arr',

  props: {
    value: [Array, String, Number],
    rule: Object,
    attr: String
  },

  methods: {
    applyFilter(value) {
      if (this.isPhone) {
        return this.$options.filters.formatPhone(value)
      }
      return value
    }
  },

  computed: {
    icon() {
      if (this.isPhone) {
        return 'phone'
      } else if (this.isEmail) {
        return 'alternate_email'
      }
      return '-'
    },
    isPhone() {
      return this.rule && /phone/.test(this.rule[this.attr])
    },
    isEmail() {
      return this.rule && /email/.test(this.rule[this.attr])
    }
  }
}
</script>
