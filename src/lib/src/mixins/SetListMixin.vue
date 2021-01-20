<script>
import SetMixin from '~~/mixins/SetMixin'

export default {
  name: 'SetListMixin',
  mixins: [SetMixin],

  methods: {
    /**
     * @param {Array} excludedAttrs - исключить атрибуты из запроса
     */
    async prepSetList(apiUrl, params, reload, excludedAttrs, parentAttr) {
      await this.$store.dispatch('prepSetList', {
        mapKey: this.mapKey,
        reload,
        apiUrl,
        excludedAttrs,
        parentAttr
      })
    }
  }
}
</script>
