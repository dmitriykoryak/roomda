import Vue from 'vue'
import config from '@/config/config'
import router from '@/router.js'

export default {
  name: 'UserState',
  state: {
    // Пользователь
    user: null,
    balance: {},
    contact: {}
  },
  mutations: {
    /**
     * Добавить в user данные
     * @param state
     * @param user
     */
    saveUser(state, user) {
      if (user.personAuthName) {
        Vue.set(user, 'firstLetters', user.personAuthName.substr(0, 1))
      }
      Vue.set(state, 'user', user)
    },

    /**
     * Добавить в contact данные
     * @param state
     * @param data
     */
    saveContact(state, data) {
      Vue.set(state, 'contact', { ...state.contact, ...data })
    },

    /**
     * Сохранить Баланс
     * @param state
     * @param data
     */
    saveBalance(state, data) {
      Vue.set(state, 'balance', data)
    }
  },

  actions: {
    /**
     * Login User
     * запись в куки на 12 часов
     * @param store
     * @param user
     * @param token
     */
    async login({ commit, dispatch, getters }) {
      const token = getters.authToken()
      if (!token) return false

      let response
      try {
        response = await getters.query.get(
          config.api.url.auth + '/user/auth/info',
          { token: token, appAccountId: config.appAccountId },
          false,
          false,
          null,
          true
        )
      } catch (e) {
        return false
      }

      // если не success === false - редирект на config.default.url.login или смена роута на config.default.routes.login
      if (!response || response.data.success !== true) {
        return false
      }

      config.api.params.required.t = token
      dispatch('saveToken', token)
      commit('saveUser', response.data.data.user)
      return true
    },

    /**
     * Logout User
     * @param store
     */
    logout({ state, getters }) {
      getters.cookie.delete('authCheckToken')
      if (config.api.params.required.uId) {
        delete config.api.params.required.uId
      }
      state.user = null
      const to =
        (config.default &&
          config.default.routes &&
          config.default.routes.login) ||
        '/login'
      const url =
        config.default && config.default.url && config.default.url.login
      if (url) {
        getters.redirect(url)
      } else {
        router.push(to)
      }
    },

    saveToken({ state, getters }, token) {
      getters.cookie.set('authCheckToken', token, 12)
    }
  },

  getters: {
    /**
     * Получить authCheckToken пользователя
     */
    authToken: (state, getters) => () => {
      const tokenInUrl = router.currentRoute.query.t
      return tokenInUrl || getters.cookie.get('authCheckToken')
    },

    /**
     * Вернуть true - если вход пользователем осуществлен
     */
    loggedIn: (state, getters) => {
      return !!state.user
    },

    /**
     * Получить полное имя пользователя
     * @returns {string}
     */
    getFullName: () => contact => {
      return (
        (contact.surname || '') +
        ' ' +
        (contact.firstname || '') +
        ' ' +
        (contact.patronymic || '')
      )
    }
  }
}
