<script>
/**
 * @TODO не исп - удалить
 * FileMixin
 */
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  methods: {
    afterChange() {
      this.clearCache()
    }
  },

  computed: {
    getRel() {
      return this.getSet(this.mapKey).coms[this.attr].options.rel
    },
    ...mapGetters(['getSet'])
  }
}
</script>
