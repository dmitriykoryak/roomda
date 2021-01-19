<template>
  <div class="fill-height map-page">
    <v-sheet :width="$vuetify.breakpoint.smAndDown ? '100%' : 400">
      <FilterBtnMenu
        @fetch:realty="fetchPlaces"
        :count="count"
        :isSale="$route.meta.isSale"
        :saleRoute="{ name: 'mapSale' }"
        :rentRoute="{ name: 'mapRent' }"
        :hideMapBtn="true"
      >
        <v-btn
          class="w-50"
          :class="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-2'"
          text
          tile
          :to="{ name: 'realtysaleList' }"
          ><v-icon left color="red">apartment</v-icon>
          Объекты
        </v-btn>
      </FilterBtnMenu>
    </v-sheet>
    <DaYandexMap
      class="no-refresh"
      :key="$route.meta.isSale"
      :zoom="11"
      :markers="markers"
    ></DaYandexMap>
    <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>

    <v-bottom-sheet v-model="sheet">
      <v-sheet :minHeight="236" tile>
        <v-container :style="{ maxWidth: '1070px' }">
          <v-fade-transition>
            <RealtyPreview
              v-if="showedRealty"
              :realty="showedRealty"
              :isSale="$route.meta.isSale"
            />
          </v-fade-transition>
          <div v-if="!showedRealty" class="d-flex align-center justify-center">
            <v-progress-circular
              indeterminate
              color="grey"
            ></v-progress-circular>
          </div>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import YandexMapMixin from '~~/components/location/YandexMapMixin.vue'
import RealtyPreview from '@/components/RealtyPreview.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    RealtyPreview
  },
  mixins: [YandexMapMixin],
  created() {
    document.title = 'Карта недвижимости'
    this.putMarkers()
  },
  mounted() {
    this.mapPaddingCorrection()
  },
  destroyed() {
    this.mapPaddingCorrection(true)
  },
  data() {
    return {
      markers: [],
      count: 0,
      sheet: false,
      showedRealty: null
    }
  },
  methods: {
    mapPaddingCorrection(onDestroyed = false) {
      if (onDestroyed && this.isMobileApp) {
        const contentDiv = document.getElementsByClassName('v-content')
        contentDiv[0].style.paddingBottom = '56px'
      } else {
        const contentDiv = document.getElementsByClassName('v-content')
        contentDiv[0].style.paddingBottom = '0px'
      }
    },
    async putMarkers() {
      const places = await this.fetchPlaces()
      this.markers = this.createMarkers(places)
    },

    async fetchPlaces() {
      this.markers = []
      let places = []
      const response = await this.query.get(
        this.$config.api.url.realty +
          '/' +
          (this.$route.meta.isSale ? 'sale' : 'rent') +
          '/default/coords',
        { city_id: this.cityId, ...this.searchItem, add: 'count' },
        true,
        true
      )
      this.count = response.data.dataAdd.count
      return response.data.data
    },

    createMarkers(places) {
      let out = []

      for (let [id, item] of Object.entries(places)) {
        if (!item.coords) continue
        id = parseInt(id)

        let to = (this.$route.meta.isSale ? '/realtysale/' : '/realty/') + id

        let marker = {
          id: id,
          coords: item.coords,
          balloon: {
            header: item.address,
            body: this.isMobileApp
              ? ''
              : `<a class="router-link-active" href="${to}">Перейти к обьекту</a>`
          },
          'cluster-name': '1',
          callbacks: {
            click: async () => {
              this.showedRealty = null
              this.sheet = true
              await this.$store.dispatch('fetchRealty', {
                params: { id: id },
                isSale: this.$route.meta.isSale,
                reload: true
              })
              this.showedRealty = this.realtyList.find(
                realty => realty.id === id
              )
            }
          }
        }

        out.push(marker)
      }
      return out
    }
  },
  computed: {
    realtyList() {
      return this.$route.meta.isSale ? this.sale : this.rent
    },
    ...mapState(['cityId', 'searchItem', 'sale', 'rent']),
    ...mapGetters(['query', 'isMobileApp'])
  },

  watch: {
    '$route.meta.isSale'() {
      this.putMarkers()
    }
  }
}
</script>
