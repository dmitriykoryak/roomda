<script>
/**
 * Mixin для перехвата видимости элемента
 */
import store from '@/store/index'
import IntersectMixinState from '~~/mixins/intersert/IntersectMixinState'
if (!store.state.IntersectMixinState) {
  store.registerModule('IntersectMixinState', IntersectMixinState)
}

export default {
  name: 'IntersectMixin',

  methods: {
    // More information about these options
    // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    onIntersect(entries, observer) {
      this.$store.commit('saveIntersecting', entries)
    }
  }
}
</script>
