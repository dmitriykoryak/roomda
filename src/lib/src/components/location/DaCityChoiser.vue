<template>
  <div class="da-city-choiser">
    <div @click="dialog = true">
      <v-icon left>place</v-icon>
      {{ cities[cityId] && cities[cityId].label }}
    </div>

    <da-dialog
      v-model="dialog"
      width="600"
      title="Выбор города"
      :randImg="randImg"
    >
      <v-card tile>
        <v-card-text class="pt-3">
          <da-select-simple
            :value="cityId"
            :items="cityItems"
            @input="changeCity($event)"
            search
          >
          </da-select-simple>
        </v-card-text>
      </v-card> </da-dialog
    ><!--Модальное окно выбора города-->
  </div>
</template>

<script>
// Динамическая регистрация модуля `DaCityChoiser`
import store from '@/store/index'
import DaCityChoiser from '~~/store/modules/DaCityChoiser.js'
if (!store.hasModule('DaCityChoiser')) {
  store.registerModule('DaCityChoiser', DaCityChoiser)
}

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  created() {
    this.fetchCities()
  },
  props: {
    randImg: Boolean
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    changeCity(cityId) {
      this.updateCityId(cityId)
      this.refreshApp()
    },
    ...mapActions({
      fetchCities: 'DaCityChoiser/fetchCities',
      refreshApp: 'DaSwipeRefresh/refreshApp',
      updateCityId: 'DaCityChoiser/updateCityId'
    })
  },
  computed: {
    cityItems() {
      let out = []
      for (const [key, data] of Object.entries(this.cities)) {
        out.push({
          value: parseInt(key),
          text: data.label
        })
      }
      return out
    },
    ...mapState('DaCityChoiser', {
      cityId: state => state.cityId,
      cities: state => state.cities || {}
    }),
    ...mapGetters('DaCityChoiser', ['cityId'])
  }
}
</script>

<style lang="scss" scoped>
.da-city-choiser {
  cursor: pointer;
}
</style>
