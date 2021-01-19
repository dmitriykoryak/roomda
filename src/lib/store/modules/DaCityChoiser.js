/**
 * Хранилище для компонента DaCityChoiser
 */
import $config from '@/config/config'

export default {
  namespaced: true,
  state: {
    cities: null
  },
  mutations: {
    saveCities(state, cities) {
      state.cities = cities
    }
  },
  actions: {
    async fetchCities(
      { commit, rootGetters },
      apiUrl = $config.api.url.crm + '/location/city/all-list'
    ) {
      const response = await rootGetters.query.get(apiUrl)
      commit('saveCities', response.data.data)
    },
    updateCityId({ rootGetters }, cityId) {
      rootGetters.storage.set('cityId', cityId)
    }
  },
  getters: {
    cityId(state, getters, rootState, rootGetters) {
      return rootGetters.storage.get('cityId') || 13
    }
  }
}
