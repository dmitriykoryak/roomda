import Vue from 'vue'
import config from '@/config/config'
import axios from 'axios'
import hash from 'object-hash'
import $store from '@/store/index'
import $router from '@/router'

export default {
  name: 'Query',
  state: {
    cache: {},
    cacheKeyAliases: {},
    loading: {
      active: false,
      progress: 0,
      ind: false,
      timer: null
    }
  },
  mutations: {
    /**
     * trigger loading
     * @param state
     * @param val
     */
    changeLoading(state, val) {
      if (!val) {
        state.loading.progress = 100
      } else {
        state.loading.ind = true
        state.loading.active = true

        if (state.timer) {
          clearTimeout(state.timer)
        }

        state.timer = setTimeout(() => {
          state.loading.active = false
          state.loading.progress = 0
        }, 1000)
      }
    },

    /**
     * Найти по алиасу кеш ключа сам ключ cacheKey и
     * очистить кеш запроса по ключу
     * @param state
     * @param {String} cacheKeyAlias
     */
    clearQueryCache(state, cacheKeyAlias) {
      const cacheKey = state.cacheKeyAliases[cacheKeyAlias]
      state.cache[cacheKey] = null
    }
  },
  getters: {
    /**
     * Создать уникальный ключ для разных url, params
     * для хранения (кеширования) запроса
     * @returns {function(*, *): *}
     */
    getCacheKey: () => (url, params) => {
      return hash({ url, params })
    },
    /**
     * Query
     * @param state
     * @param getters
     * @return {{post: (function(*=, *=, *=, *=): Promise<T>), get: (function(*=, *=, *=, *=): Promise<T>), delete: (function(*=, *=, *=, *=): Promise<T>), put: (function(*=, *=, *=, *=): Promise<T>)}}
     */
    query() {
      let apiClient = axios

      return {
        /**
         * Create a query instance
         * @param {String} domain
         */
        create(url) {
          apiClient = axios.create({
            baseURL: url
          })
          return this
        },
        /**
         * Выполнить перед запросом
         * @param loadingProgress
         * @private
         */
        _preQuery(loadingProgress) {
          loadingProgress && $store.commit('changeLoading', true)
        },

        /**
         * Выполнить после запроса
         * @private
         */
        _postQuery(loadingProgress) {
          loadingProgress && $store.commit('changeLoading', false)
        },

        /**
         * Выполнить после запроса с кодом === 200 -2**
         * @param loadingProgress
         * @param url
         * @param response
         * @param checkResponse
         * @private
         */
        _postSuccessQuery(
          loadingProgress,
          url,
          response,
          checkResponse = true
        ) {
          this._postQuery(loadingProgress)
          if (!response || (checkResponse && response.data.success === false)) {
            throw new Error('Запрос к Api: ' + url + ' вернул success: false')
          }
        },

        /**
         * Выполнить после запроса с кодом !== 200 -2**
         * @param loadingProgress
         * @param url
         * @param errors
         * @param context
         * @param {Boolean} errorPropagation - всплывание ошибки
         * @param {Boolean} showMsg - показать ошибки Api валидации всплывающим сообщением (snackbar)
         * @private
         */
        _postErrorQuery(
          loadingProgress,
          url,
          params,
          errors,
          context,
          errorPropagation = false,
          showMsg = false
        ) {
          let getters = $store.getters

          this._postQuery(loadingProgress)

          // Если глобальная ошибка от API
          if (errors.response.data.data.message) {
            $store.commit('DaSnackbar/show', {
              text: errors.response.data.data.message,
              icon: 'warning',
              color: 'warning',
              hideBtn: true,
              pos: 'bottom',
              timeout: 2000
            })
          } else if (errors.response.status === 403) {
            $store.commit('DaSnackbar/show', {
              text: 'У вас нет прав доступа к просмотру данного контента',
              icon: 'error',
              color: 'error',
              hideBtn: true,
              pos: 'bottom',
              timeout: 2000
            })
            $router.push('/')
          } else {
            console.log(
              'Запрос: ' +
                url +
                //' c параметрами: ' + JSON.stringify(params)  +
                ' вернул ' +
                errors.message
            )
          }

          if (context || showMsg) {
            getters.validateOnApi(errors, context, showMsg)
          }

          if (errorPropagation) {
            throw errors
          } else {
            throw new Error('Stop script (not error)')
          }
        },

        /**
         * Добавить в строку запроса дополнительные параметры (параметры послать методом GET)
         * @param {String} url
         * @param {Array} params
         */
        _addGetParams(url, addParams) {
          let outParams = '?'
          addParams.forEach(paramName => {
            if (!config.api.params || !config.api.params[paramName]) return
            for (let key in config.api.params[paramName]) {
              outParams += key + '=' + config.api.params[paramName][key] + '&'
            }
          })
          outParams = outParams.substring(0, outParams.length - 1)
          // Если последний символ '/' - удалить
          if (url.charAt(url.length - 1) === '/') {
            url = url.substring(0, url.length - 1)
          }
          return url + outParams
        },

        /**
         * Добавить в запрос дополнительные параметры
         * @param {String} url
         * @param {Array} params
         * @param {Array} addParams массив вида:[paramName, ...], где config.api.params[paramName]
         */
        _addParams(url, params, addParams) {
          if (config.api.params && config.api.params.required) {
            params = { ...params, ...config.api.params.required }
          }
          if (addParams && addParams.length) {
            url = this._addGetParams(url, addParams)
          }
          return { url, params }
        },

        /**
         * Запрос get
         * @param {String} url
         * @param {Object} params
         * @param {Boolean} loadingProgress
         * @param {Boolean, String} jsCache - кешировать средствами js (jsCache может принимать значение String
         * - тогда это будет служить алиасом для cacheKeyAlias по которому в дальшейшем будет легко очистить $store.Query.state.cache с помощью геттера clearQueryCache)
         * @param {Array} addParams - добавить в запрос дополнительные параметры из config.api.params = {paramName: ...}
         * @param {Boolean} errorPropagation - всплывание ошибки
         * @param {Boolean} storageCache - кешировать ли данные в localStorage
         * @return {Promise<*>}
         */
        async get(
          url,
          params = {},
          loadingProgress = true,
          jsCache = false,
          addParams = [],
          errorPropagation = false,
          storageCache = false
        ) {
          let response
          let state = $store.state.Query
          let getters = $store.getters

          // если был уже такой запрос и данные по ключу cacheKey уже есть, то запрос не делать
          const cacheKey = getters.getCacheKey(url, params)
          //JS кеш - сессионый
          if (state.cache[cacheKey]) {
            if (typeof jsCache === 'string') {
              state.cacheKeyAliases = {
                ...state.cacheKeyAliases,
                [jsCache]: cacheKey
              }
              response = state.cache[cacheKey]
            } else if (jsCache) {
              response = state.cache[cacheKey]
            }
            //Local storage кеш
          } else if (!response && process.env.NODE_ENV === 'production') {
            //response = getters.storageLimit().get(cacheKey)
          }

          if (!response) {
            this._preQuery(loadingProgress)

            let q = this._addParams(url, params, addParams)

            try {
              response = await apiClient.get(q.url, { params: q.params })
            } catch (e) {
              this._postErrorQuery(
                loadingProgress,
                q.url,
                q.params,
                e,
                null,
                errorPropagation
              )
            }

            Vue.set(state.cache, cacheKey, response)
            if (storageCache && process.env.NODE_ENV === 'production') {
              //getters.storageLimit().set(cacheKey, response)
            }
          }

          this._postSuccessQuery(loadingProgress, url, response)
          return response
        },

        /**
         * Запрос post
         * @param url
         * @param params
         * @param loadingProgress
         * @param addParams
         * @param contextIfApiValidation - передать контекст для Api валидации
         * @param {Boolean} errorPropagation - всплывание ошибки
         * @param {Boolean} showMsg - показать ошибки Api валидации всплывающим сообщением (snackbar)
         * @return {Promise<*>}
         */
        async post(
          url,
          params = {},
          loadingProgress = true,
          addParams = [],
          contextIfApiValidation,
          errorPropagation = false,
          showMsg = false
        ) {
          let response
          this._preQuery(loadingProgress)

          let q = this._addParams(url, params, addParams)

          try {
            response = await apiClient.post(q.url, q.params)
          } catch (e) {
            this._postErrorQuery(
              loadingProgress,
              q.url,
              q.params,
              e,
              contextIfApiValidation,
              errorPropagation,
              showMsg
            )
          }

          this._postSuccessQuery(loadingProgress, url, response)
          return response
        },

        /**
         * Запрос put
         * @param url
         * @param params
         * @param loadingProgress
         * @param addParams
         * @param contextIfApiValidation - передать контекст для Api валидации
         * @param {Boolean} errorPropagation - всплывание ошибки
         * @param {Boolean} showMsg - показать ошибки Api валидации всплывающим сообщением (snackbar)
         * @return {Promise<*>}
         */
        async put(
          url,
          params = {},
          loadingProgress = false,
          addParams = [],
          contextIfApiValidation,
          errorPropagation = false,
          showMsg = false
        ) {
          let response
          this._preQuery(loadingProgress)

          // axios not send param = undefined
          for (let [key, val] of Object.entries(params)) {
            if (val === undefined) {
              params[key] = null
            }
          }

          let q = this._addParams(url, params, addParams)

          try {
            response = await apiClient.put(q.url, q.params)
          } catch (e) {
            this._postErrorQuery(
              loadingProgress,
              q.url,
              q.params,
              e,
              contextIfApiValidation,
              errorPropagation,
              showMsg
            )
          }

          this._postSuccessQuery(loadingProgress, url, response)
          return response
        },

        /**
         * Запрос delete
         * @param url
         * @param params
         * @param loadingProgress
         * @return {Promise<*>}
         */
        async delete(url, params = {}, loadingProgress = false) {
          let response
          this._preQuery(loadingProgress)
          if (config.api.params && config.api.params.required) {
            params = { ...params, ...config.api.params.required }
          }
          try {
            response = await apiClient.delete(url, { params: params })
          } catch (e) {
            this._postErrorQuery(loadingProgress, url, params, e)
          }
          this._postSuccessQuery(loadingProgress, url, response, false)
          return response
        }
      }
    },

    /**
     * Запросы, эмулирующие запросы формы (нажатие кнопки Submit)
     */
    formQuery() {
      return {
        post(path, params, method = 'post') {
          const form = document.createElement('form')
          form.method = method
          form.action = path

          for (const key in params) {
            if (params.hasOwnProperty(key)) {
              const hiddenField = document.createElement('input')
              hiddenField.type = 'hidden'
              hiddenField.name = key
              hiddenField.value = params[key]

              form.appendChild(hiddenField)
            }
          }

          document.body.appendChild(form)
          form.submit()
        }
      }
    }
  }
}
