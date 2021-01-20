<template></template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MenuMixin',

  data() {
    return {
      label: null
    }
  },

  methods: {
    async getMenuStruc(strucId = null) {
      let items = []
      let struc_id_rel =
        strucId || (this.menuConfig && this.menuConfig.struc_id_rel)
      const response = await this.query.get(
        this.$config.api.url.auth + '/site/struc/' + struc_id_rel,
        { expand: 'menu' }
      )
      const struc = response.data.data

      if (!struc) return

      this.label = struc.label
      struc.menu.forEach(rawItem => {
        const item = {
          icon: rawItem.icon_class || 'fas fa-chevron-right',
          label: rawItem.label,
          url: rawItem.url
        }
        items.push(item)
      })

      return items
    }
  },

  computed: {
    menuConfig() {
      const compare = this.getCompare(this.$route.path)
      return compare && compare.menu && compare.menu.config
    },
    /**
     * No alias Fix
     * Причина фикса: после домена ставится слеш перед Get параметром
     * и из-за этого не подсвечивается активный menu link при переходе по ссылке domain/?getParam=...
     * @return {boolean}
     */
    noAliasFix() {
      let forUpdate = this.$route.path
      return this.url().alias !== this.emptyAlias
    },
    ...mapState({
      site: state => state.SiteState.site,
      emptyAlias: state => state.Url.emptyAlias
    }),
    ...mapGetters({
      getCompare: 'getCompare',
      url: 'url',
      query: 'query'
    })
  }
}
</script>
