/**
 * Глобальные директивы
 */
import Vue from 'vue'
import { mask } from 'vue-the-mask'

Vue.directive('mask', mask)

// Директива для отмены focus на элементе
Vue.directive('blur', {
  inserted: function(el) {
    el.onfocus = event => {
      return event.target.blur()
    }
  }
})
