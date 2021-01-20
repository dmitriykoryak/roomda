import Vue from 'vue'

export default {
  name: 'ComState',
  state: {
    searchCard: {
      filterToolbarButton: false
    }
  },
  mutations: {
    setSearchCard(state, data) {
      Vue.set(state, 'searchCard', data)
    }
  }
}
