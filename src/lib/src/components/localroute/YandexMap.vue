<template>
  <da-yandex-map
    :coords="coords"
    @map-was-initialized="mapInit($event)"
    :markers="markers"
  >
  </da-yandex-map>
</template>

<script>
import YandexMapMixin from '~~/components/location/YandexMapMixin'

export default {
  name: 'yandex-map',

  mixins: [YandexMapMixin],

  data: () => ({
    address: null,
    coords: [45, 56],
    markers: []
  }),

  methods: {
    async mapInit() {
      const address = this.$route.query.address
      if (!address) return

      let markers = [
        {
          address: address
        }
      ]
      await this.getCoordsByAddress(markers)
      this.markers = this.addMarkerInfo(markers)
    }
  }
}
</script>
