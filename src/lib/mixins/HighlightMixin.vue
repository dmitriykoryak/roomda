<script>
/**
 * HighlightMixin
 */
import Vue from 'vue'

// Директива `v-highlight`
Vue.directive('highlight', {
  inserted: function(el) {
    // добавить класс highlight-item
    el.classList.add('highlight-item')
  },

  update: function(el, binding) {
    // подсветить если item.highlight = true
    Vue.nextTick(() => {
      if (binding.value.highlight) {
        el.classList.add('highlighted')
        setTimeout(() => el.classList.remove('highlighted'), 3000)
      }
    })
  }
})

export default {
  name: 'HighlightMixin',

  methods: {
    /**
     * Подсветить элемент на delay ms
     * */
    highlightItem(item, delay = 2000) {
      if (item) {
        Vue.set(item, 'highlight', true)
        setTimeout(() => Vue.set(item, 'highlight', false), delay)
      }
    }
  }
}
</script>

<style lang="scss">
.highlight-item {
  transition: color 0.5s ease-in-out;

  &.highlighted {
    color: #ff0001 !important;
    transition: none;
  }
}
</style>
