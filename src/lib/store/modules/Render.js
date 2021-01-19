import Vue from 'vue'

export default {
  /**
   * Глобльное состояние приложения
   */
  state: {
    /**
     * Прорисовывать ли компоненты приложения(инициализация приложения)
     */
    renderComs: {
      mode: 0,
      // Варианты состояния контента приложения
      // - hide: компоненты скрыты
      // - rerender: повторная перерисовка
      // - show: компоненты отображены
      MODE_HIDE: 0,
      MODE_RERENDER: 1,
      MODE_SHOW: 2
    }
  },

  mutations: {
    /**
     * render, re-render App
     * @param state
     * @param mode - значение state.renderComs.MODE_...
     */
    changeRenderMode(state, mode) {
      state.renderComs.mode = mode
    }
  },

  actions: {
    /**
     * Переинициализация приложения с очищением state
     * @param store
     * @return {Promise<void>}
     */
    async reRenderApp({ state, commit }) {
      commit('changeRenderMode', state.renderComs.MODE_HIDE)
      commit('clearState')
      Vue.nextTick(() => {
        commit('changeRenderMode', state.renderComs.MODE_RERENDER)
        setTimeout(
          () => commit('changeRenderMode', state.renderComs.MODE_SHOW),
          500
        )
      })
    }
  }
}
