<script>
/**
 * SetMixin
 */
import Vue from 'vue'
import config from '@/config/config'
import { mapGetters } from 'vuex'

//@todo Динамическое подключение модулей выдает ошибку-> (TypeError: "can't access property "components", options is undefined")
// import store from '@/store'
// import SetState from '~~/store/modules/SetState'
// if (!store.state.SetState) {
//   store.registerModule('SetState', SetState)
// }

export default {
  name: 'SetMixin',

  data: () => ({
    sums: null
  }),

  methods: {
    /**
     * Получить labels header и search по API
     * и записать в хранилище
     */
    async fetchSet(url, params = {}, reload = false) {
      await this.$store.dispatch('fetchSet', {
        url,
        params,
        mapKey: this.mapKey,
        reload,
        $vuetify: this.$vuetify,
        parentAttr: this.parentAttr
      })
    },

    /**
     * Вернуть label из set, добавить * если rules -> required
     */
    getLabel(attr, label) {
      const scenario = this.scenario || 'create'
      const isRequired =
        this.rules[scenario] &&
        this.rules[scenario][attr] &&
        this.rules[scenario][attr].includes('required')
      return (label || this.labels[attr] || '') + (isRequired ? ' *' : '')
    }
  },

  computed: {
    set() {
      return this.getSet(this.mapKey)
    },
    groups() {
      return this.set.groups
    },
    headersFull() {
      return this.set.headersFull || []
    },
    headers() {
      return this.set.headers || []
    },
    tooltips() {
      return this.set.tooltips || {}
    },
    labels() {
      return this.set.labels || {}
    },
    sort() {
      return this.set.sort || {}
    },
    struc() {
      return this.set.struc || {}
    },
    attrs() {
      return Object.keys(this.labels)
    },
    rules() {
      return this.set.rules || {}
    },
    curRules() {
      return this.rules[this.scenario || 'create'] || {}
    },
    coms() {
      return this.set.coms
    },
    fastfilter() {
      return this.set.fastfilter
    },
    ...mapGetters(['getSet'])
  },

  watch: {
    'set.sums': {
      handler(sums) {
        if (sums && !this.sums) {
          this.sums = {}
          for (let [attr, config] of Object.entries(sums)) {
            let params = {}
            if (config['get']) {
              for (let [key, val] of Object.entries(config['get'])) {
                params = { ...params, [key]: val }
              }
            }

            this.query
              .get(this.apiUrl + '/' + config.url, params)
              .then(response => {
                Vue.set(this.sums, attr, response.data.data)
              })
          }
        }
      },
      deep: true
    }
  }
}
</script>
