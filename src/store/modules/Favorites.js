import Vue from 'vue'
import $store from '@/store/index'
export default {
  name: 'Favorites',
  namespaced: true,
  state: {
    storageKey: 'fav',
    items: {}
  },
  mutations: {
    init(state) {
      state.items = $store.getters.storage.get(state.storageKey) || {}
    },
    add(state, { favKey, id }) {
      if (!state.items[favKey]) {
        Vue.set(state.items, favKey, [])
      }
      state.items[favKey].push(id)
      $store.getters.storage.set(state.storageKey, state.items)
    },
    delete(state, { favKey, id }) {
      const index = state.items[favKey].indexOf(id)
      if (index > -1) {
        state.items[favKey].splice(index, 1)
        $store.getters.storage.set(state.storageKey, state.items)
      }
    }
  }
}
