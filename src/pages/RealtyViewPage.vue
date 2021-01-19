<template>
  <realty-view
    :realty="realty"
    :markers="markers"
    :mapKey="mapKey"
    :isSale="$route.meta.isSale"
  />
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import RealtyView from '@/components/RealtyView.vue'
import YandexMapMixin from '~~/components/location/YandexMapMixin.vue'

export default {
  mixins: [YandexMapMixin],
  components: { RealtyView },
  mounted() {
    this.init()
  },

  data() {
    return {
      mapKey: null,
      markers: []
    }
  },

  methods: {
    async init() {
      this.mapKey = this.$route.meta.isSale ? 'sale/default' : 'rent/default'
      await this.$store.dispatch('fetchRealty', {
        params: { id: this.$route.params.id },
        isSale: this.$route.meta.isSale
      })
      this.markers = await this.createMarkers([this.realty])
    },

    async createMarkers(iterable) {
      let markers = iterable.map(async marker => {
        return {
          address: this.getAddress(marker),
          coords: await this.getCoordsByAddress(marker.address)
        }
      })
      markers = this.addMarkerInfo(markers)
      return markers
    },

    getAddress(item) {
      const city = this.getListLabel(this.mapKey, 'city_id', item.city_id, item)
      let address = city + ', ' + item.street + ', ' + item.home

      if (item.flat) {
        address += ', ' + item.flat
      }
      return address
    },

    addMarkerInfo(markers) {
      let out = []
      markers.forEach(async item => {
        if (!item.coords) return out

        let marker = {
          id: item.id + '-' + (item.success || ''),
          coords: item.coords,
          balloon: {
            header: '',
            body: item[this.addressAttr]
          },
          label: item[this.addressAttr],
          colors: {
            fill: item.success ? '#8BC34A' : '#2196F3',
            stroke: item.success ? '#f4ff00' : '#ff1700'
          },
          callbacks: {
            click: () => {
              if (!item.success) {
                this.editedTask = item
                return (this.sheet = true)
              }
            }
          }
        }
        out.push(marker)
      })
      return out
    }
  },

  computed: {
    realtyList() {
      return this.$route.meta.isSale ? this.sale : this.rent
    },
    realty() {
      return this.realtyList.find(
        realty => realty.id === parseInt(this.$route.params.id)
      )
    },
    ...mapState(['sale', 'rent']),
    ...mapGetters(['getListLabel'])
  }
}
</script>

<style lang="scss" scoped></style>
