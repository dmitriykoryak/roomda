<template> </template>

<script>
import { mapState, mapGetters } from 'vuex'
import SetListMixin from '~~/mixins/SetListMixin'

export default {
  name: 'contract-mixin',

  mixins: [SetListMixin],

  data: () => ({
    scenario: 'create',
    mapKey: 'contract/default'
  }),

  methods: {
    async contractMixinInit(addParams = null, isMakeAddress = true) {
      await this.prepSetList(this.$config.api.url.crm)
      await this.getContracts(addParams, isMakeAddress)
    },

    async getContracts(addParams, isMakeAddress) {
      if (this.contracts.length) return

      let params = {
        funnelStageIsEnd: '0'
      }
      if (addParams) {
        params = { ...params, ...addParams }
      }
      const response = await this.query.get(
        this.$config.api.url.crm + '/' + this.mapKey,
        params,
        true,
        false,
        ['list']
      )
      this.contracts = []

      if (isMakeAddress) {
        response.data.data.forEach(c => {
          let a = this.makeAddress(c)
          this.contracts.push({
            ...c,
            address: this.makeAddress(c)
          })
        })
      } else {
        this.contracts = response.data.data
      }
      this.contractsCount = response.data.dataAdd.count
    },

    /**
     * Составить адрес
     * @param contract
     * @return {string}
     */
    makeAddress(contract) {
      let address
      let listItem =
        this.getListItem(
          this.mapKey,
          'city_id',
          contract['city_id'],
          contract,
          null
        ) || {}
      const city = listItem.label

      if (city) {
        address =
          'г.' +
          city +
          ' ул.' +
          (contract.street || '') +
          ' ' +
          (contract.home || '')

        if (contract.integer3) {
          address += '/' + contract.integer3
        }
      }
      return address || 'Адрес не задан'
    }
  },
  computed: {
    contracts: {
      get() {
        return this.$store.state.MusoroffState.contracts
      },
      set(contracts) {
        this.$store.commit('saveContracts', contracts)
      }
    },
    contractsCount: {
      get() {
        return this.$store.state.MusoroffState.contractsCount
      },
      set(contractsCount) {
        this.$store.commit('saveContractsCount', contractsCount)
      }
    },
    ...mapState({
      user: state => state.UserState.user
    }),
    ...mapGetters(['getListItem'])
  }
}
</script>
