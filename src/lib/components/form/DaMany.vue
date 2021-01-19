<template>
  <div>
    <template>
      <div
        class="d-flex align-center"
        v-for="(iter, index) in iterations"
        :key="index"
      >
        <div class="flex-grow-1">
          <slot v-bind="{ index, updateAttr }"></slot>
        </div>
        <v-btn
          icon
          smalls
          class="ml-1"
          :class="outlined ? ' outlined-center-correction' : ''"
          @click="
            index === 0
              ? iterations++
              : iterations > 1
              ? delIteration(index)
              : null
          "
        >
          <v-icon>
            {{ index === 0 ? 'add' : 'remove' }}
          </v-icon>
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * Компонент для создания множественных полей
 */
import Vue from 'vue'

export default {
  created() {
    this.createIterableValue()
    // установить нужное количество итераций
    this.iterations =
      (this.value[this.attrs[0]] && this.value[this.attrs[0]].length) || 1
  },
  props: {
    value: Object,
    attrs: Array,
    outlined: Boolean
  },

  data: () => ({
    iterations: 1
  }),

  methods: {
    createIterableValue() {
      let valueCopy = { ...this.value }
      this.attrs.forEach(attr => {
        if (!valueCopy[attr]) {
          valueCopy[attr] = []
        }
      })
      this.$emit('input', valueCopy)
    },
    delIteration(index) {
      this.iterations--
      let valueCopy = { ...this.value }
      this.attrs.forEach(attr => {
        valueCopy[attr].splice(index, 1)
      })
      console.log(valueCopy)
      this.$emit('input', valueCopy)
    },
    updateAttr(index, item, attr, value) {
      let itemClone = { ...item }
      Vue.set(itemClone[attr], index, value)
      this.$emit('input', itemClone)
    }
  }
}
</script>

<style scoped lang="scss">
.outlined-center-correction {
  margin-top: -26px;
}
</style>
