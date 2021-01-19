<template>
  <v-snackbar
    v-model="snackbar.model"
    :top="snackbar.pos === 'top'"
    :bottom="snackbar.pos === 'bottom'"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    <v-icon v-if="snackbar.icon" :color="snackbar.iconColor" left>
      {{ snackbar.icon }}
    </v-icon>

    <div class="f-flex flex-column flex-grow-1">
      <div v-if="snackbar.title" class="d-flex align-center">
        <span v-html="snackbar.title" class="yellow--text"></span>
      </div>
      <div v-html="snackbar.text"></div>
    </div>

    <v-btn
      v-if="!snackbar.hideBtn"
      color="red"
      text
      tile
      @click.stop="snackbar.model = false"
    >
      Закрыть
    </v-btn>
  </v-snackbar>
</template>

<script>
/**
 * Надстройка над v-snackbar
 */
// Динамическая регистрация модуля `DaSnackbar`
import store from '@/store/index'
import DaSnackbar from '~~/store/modules/DaSnackbar.js'
if (!store.hasModule('DaSnackbar')) {
  store.registerModule('DaSnackbar', DaSnackbar)
}

export default {
  name: 'da-snackbar',

  data: () => ({}),

  props: {
    value: String
  },

  computed: {
    snackbar: {
      get() {
        return this.$store.state.DaSnackbar.snackbar
      },
      set(val) {
        this.$store.state.DaSnackbar.snackbar = val
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
