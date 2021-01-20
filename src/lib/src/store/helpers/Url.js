import config from '@/config/config'
import router from '@/router'
import store from '@/store/index'
import Url from 'url-parse'
import axios from 'axios'

export default {
  state: {
    emptyAlias: 'no-alias'
  },
  getters: {
    /**
     * Добавить параметры в URL
     * @returns {Function}
     */
    insertUrlParam: () => (key, value) => {
      key = encodeURI(key)
      value = encodeURI(value)

      let params = document.location.search.substr(1).split('&')

      let i = params.length
      let keyValue
      while (i--) {
        keyValue = params[i].split('=')

        if (keyValue[0] == key) {
          // если такой параметр уже есть в url от за земенить его
          keyValue[1] = value
          if (!value.length) {
            keyValue = []
          }
          params[i] = keyValue.join('=')
          break
        }
      }

      if (i < 0 && value.length) {
        params[params.length] = [key, value].join('=')
      }

      window.history.pushState({}, '', '?' + params.join(''))
    },

    protocol: () => {
      return window.location.protocol || 'https:'
    },

    /**
     * Получить domain, service, mapKey, alias, scenario из url
     * @param state
     * @param getters
     * @return {function(*=, *=): {domain: string, mapKey: string, alias: string, api: string}}
     */
    url: (state = null, getters = null) => (path = null, mapKeyInit = null) => {
      let mapKey = ''
      let mapKeyFull = ''
      let domain
      let scenario

      // если мобильное приложение, то domain ставиться hard
      // если web - domain взять из url
      if (getters && getters.isMobileApp) {
        domain =
          config.appAccountId +
          '.' +
          config.service +
          '.' +
          config.default.domainWithoutService
      } else {
        domain = window.location.hostname
      }

      if (!path) {
        path = router.currentRoute.path
      }

      let parts = path.split('/')
      if (parts.length > 6) {
        // в моб версии path c двумя слешами - один удалить
        parts = parts.splice(1)
      }

      let alias = parts[1].length === 0 ? state.emptyAlias : parts[1]

      //Получить сценарий из url
      const scenarioPart = parts[4]

      if (scenarioPart === 'create') {
        scenario = 'create'
      } else if (scenarioPart === 'update') {
        scenario = 'update'
      } else if (scenarioPart === 'view') {
        scenario = 'view'
      } else if (scenarioPart === 'chart') {
        scenario = 'chart'
      } else {
        scenario = 'search'
      }

      if (parts[2]) {
        mapKey = mapKey + parts[2]
      }
      if (parts[3]) {
        mapKey = mapKey + '/' + parts[3]
      }
      if (!mapKey && mapKeyInit) {
        mapKey = mapKeyInit
      }

      if (scenarioPart && !parseInt(scenarioPart)) {
        mapKeyFull = mapKey + '/' + scenarioPart
      } else {
        mapKeyFull = mapKey
      }

      return {
        protocol: getters.protocol,
        domain: domain,
        alias: alias,
        mapKey: mapKey,
        mapKeyFull: mapKeyFull,
        scenario: scenario,
        parts: parts
      }
    },

    redirect: (state, getters) => async url => {
      // Если MobileApp - вместо редиректа сделать переинициализацию приложения сменив service без очистки state
      if (getters.isMobileApp) {
        let u = new Url(url)
        let pathname = u.pathname ? u.pathname : '/' + state.emptyAlias
        let parts = u.host.split('.')
        config.service = parts[1]

        store.commit(
          'changeRenderMode',
          store.state.Render.renderComs.MODE_HIDE
        )
        store.commit('clearState', true)
        router.push(pathname + u.query)

        store.commit(
          'changeRenderMode',
          store.state.Render.renderComs.MODE_RERENDER
        )
        setTimeout(() => {
          if (
            store.state.Render.renderComs.mode ===
            store.state.Render.renderComs.MODE_RERENDER
          ) {
            store.commit(
              'changeRenderMode',
              store.state.Render.renderComs.MODE_SHOW
            )
            store.dispatch('fetchSiteCompare')
          }
        }, 500)
      } else {
        window.location.href = url
      }
    },

    urlHasAnchor: () => () => {
      return router.currentRoute.fullPath.includes('#')
    },

    /**
     * Скачать фаил по указанному url
     */
    downloadFile: (state, getters) => (url, fileName) => {
      axios
        .get(url + '?t=1&k=1', { responseType: 'blob' })
        .then(response => {
          if (!!window.cordova) {
            window.location.href = url
          } else {
            const blob = new Blob([response.data], { type: 'application/png' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.target = '_blank'
            link.click()
            URL.revokeObjectURL(link.href)
          }
        })
        .catch(console.error)
    }
  }
}
