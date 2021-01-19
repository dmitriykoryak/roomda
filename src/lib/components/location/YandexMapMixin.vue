<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    apikey: '795e4b78-7026-4a49-8272-bf3d1c05deb6'
  }),

  methods: {
    async setCoordsInMarker(marker, addressAttr = 'address') {
      const coords = await this.getCoordsByAddress(marker[addressAttr])
      Vue.set(marker, 'coords', coords)
    },

    async getCoordsByAddress(address) {
      const response = await this.query.get(
        'https://geocode-maps.yandex.ru/1.x',
        {
          geocode: `Россия, ${address}`,
          apikey: this.apikey
        }
      )
      const parser = new DOMParser()
      const xml = parser.parseFromString(response.data, 'text/xml')
      const els = xml.getElementsByTagName('pos')
      const coordsRaw = els[0].innerHTML.split(' ')
      return [coordsRaw[1], coordsRaw[0]]
    },

    async getAddressByCoords(coords) {
      const response = await this.query.get(
        'https://geocode-maps.yandex.ru/1.x',
        {
          geocode: [coords[1], coords[0]].join(','),
          apikey: this.apikey
        }
      )
      const parser = new DOMParser()
      const xml = parser.parseFromString(response.data, 'text/xml')
      const els = xml.getElementsByTagName('formatted')
      return els[0].innerHTML
    }
  },

  computed: {
    ...mapGetters(['query'])
  }
}
</script>
