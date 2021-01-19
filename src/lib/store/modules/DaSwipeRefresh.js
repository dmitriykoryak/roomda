/**
 * Хранилище для компонента DaSwipeRefresh
 */
import Vue from 'vue'
import $store from '@/store/index'

export default {
  namespaced: true,
  state: {
    defaultState: null,
    rerenderAppTrigger: false
  },
  mutations: {
    /**
     * клонирование rootState в переменную defaultState
     */
    cloneState(state) {
      state.defaultState = Vue._.cloneDeep($store.state)
    },
    rerenderComs(state) {
      state.rerenderAppTrigger = !state.rerenderAppTrigger
    }
  },
  actions: {
    refreshApp({ state, commit }) {
      $store.replaceState(Vue._.cloneDeep(state.defaultState))
      commit('cloneState')
      Vue.nextTick(() => {
        commit('rerenderComs')
      })
    }
  }
}
