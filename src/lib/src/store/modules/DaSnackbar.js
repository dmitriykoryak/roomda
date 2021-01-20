/**
 * Всптывающие подсказки
 */
export default {
  namespaced: true,
  state: {
    snackbar: {
      model: false,
      pos: 'top',
      title: null,
      text: null,
      icon: null,
      iconColor: null,
      timeout: 6000,
      hideBtn: false
    }
  },

  mutations: {
    /**
     * Показать всптывающюю подсказку
     * послать обьект = {
     *     text: 'text',
     *     title: 'title',
     *     pos: top|bottom,
     *     ...
     * }
     * @param state
     * @param {Object} msg
     */
    show(state, msg) {
      state.snackbar.text = msg.text
      state.snackbar.title = msg.title
      state.snackbar.icon = msg.icon
      state.snackbar.iconColor = msg.iconColor || 'white'
      if (msg.timeout !== undefined) {
        state.snackbar.timeout = msg.timeout
      }
      state.snackbar.hideBtn = msg.hideBtn
      state.snackbar.color = msg.color
      if (msg.pos) {
        state.snackbar.pos = msg.pos
      }
      state.snackbar.model = true
    },

    /**
     * Скрыть всптывающюю подсказку
     * @param state
     */
    close(state) {
      state.snackbar.model = false
      state.snackbar.text = null
      state.snackbar.title = null
      state.snackbar.icon = null
      state.snackbar.iconColor = ''
      state.snackbar.timeout = 6000
      state.snackbar.hideBtn = false
      state.snackbar.pos = 'top'
    }
  }
}
