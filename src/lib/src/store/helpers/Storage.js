import Vue from 'vue'

export default {
  getters: {
    /**
     * Сохранение/Выборка в/из localStorage
     * @param state
     * @param getters
     * @return {{set: set, get: (function(*=): any), delete: delete}}
     */
    storage: (state, getters) => {
      return {
        get: key => {
          let outData
          let data = Vue.localStorage.get(key)
          try {
            outData = JSON.parse(data)
          } catch (e) {
            return data
          }
          return outData
        },

        set: (key, data) => {
          let savedData
          if (typeof data === 'string' || typeof data === 'number') {
            savedData = data
          } else {
            savedData = JSON.stringify(data)
          }
          Vue.localStorage.set(key, savedData)
        },

        delete: key => {
          Vue.localStorage.remove(key)
        }
      }
    },

    /**
     * Сохранение/Выборка в/из localStorage с лимитом по времени
     * @param {Number} limit (s) - default = 1ч
     */
    storageLimit: (state, getters) => (limit = 60 * 60) => {
      limit = limit * 1000
      return {
        //если запрос устарел на limit(s) (default = 1ч), то удалить данные из localStorage и вернуть false
        get: key => {
          let data = getters.storage.get(key)
          if (!data) return null

          if (data.savedTime && +new Date() - data.savedTime > limit) {
            getters.storage.delete(key)
            return null
          } else {
            Vue.delete(data, 'savedTime')
            return data
          }
        },

        set: (key, data) => {
          const savedData = {
            savedTime: +new Date(),
            ...data
          }
          getters.storage.set(key, savedData)
        },

        delete: key => {
          getters.storage.delete(key)
        }
      }
    },

    /**
     * Сохранение/Выборка в/из cookie
     * @param state
     * @param getters
     * @param {Number} limit (ч) - default = 1ч
     * @return {{set: set, get: (function(*=): any), delete: delete}}
     */
    cookie: (state, getters) => {
      return {
        get: key => {
          return Vue.cookie.get(key)
        },

        set: (key, data, limit = 1) => {
          Vue.cookie.set(key, data, {
            expires: getters.getDateForHours(limit)
          })
        },

        delete: key => {
          Vue.cookie.delete(key)
        }
      }
    }
  }
}
