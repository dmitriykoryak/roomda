import Vue from 'vue'
import store from '@/store/index'
import config from '@/config/config'

export default {
  name: 'GridState',
  state: {
    //Обьект данных приложения
    data: {},
    depends: {},
    maps: {},
    //promise выполняемый перед сохранением в Grid
    beforeSave: null,
    //массив promises выполняемый после сохранения в Grid
    afterSave: {}
  },
  mutations: {
    createComponentState(state, { mapKey, service = config.service }) {
      if (!state.data[service] || !state.data[service][mapKey]) {
        const emptyData = {
          [mapKey]: {
            itm: {
              items: [],
              totalItems: 0
            }
          }
        }
        Vue.set(state.data, service, { ...state.data[service], ...emptyData })
      }
    },

    saveItem(state, { mapKey, data, service = config.service }) {
      let index = state.data[service][mapKey].itm.items.findIndex(
        item => item.id === Number(data.id)
      )
      if (index === -1) {
        state.data[service][mapKey].itm.items.unshift(data)
        ++state.data[service][mapKey].itm.totalItems
      } else {
        Vue.set(state.data[service][mapKey].itm.items, index, {
          ...state.data[service][mapKey].itm.items[index],
          ...data
        })
      }
    },

    saveItems(state, { mapKey, data, service = config.service }) {
      Vue.set(state.data[service][mapKey], 'itm', data)
    },

    delItems(state, { mapKey, index, service = config.service }) {
      let del = index => {
        const deletedItems = state.data[service][mapKey].itm.items.splice(
          index,
          1
        )
        if (deletedItems.length) {
          --state.data[service][mapKey].itm.totalItems
        }
      }

      if (Array.isArray(index)) {
        for (var i = index.length - 1; i >= 0; i--) {
          state.data[service][mapKey].itm.items.splice(index[i], 1)
        }
      } else {
        del(index)
      }
    },

    /**
     * Удалить все items
     * @param {object} state
     * @param {string} mapKey
     * @param {string} service
     */
    clearItems(state, { mapKey, service = config.service }) {
      if (
        state.data[service] &&
        state.data[service][mapKey] &&
        state.data[service][mapKey].itm
      ) {
        state.data[service][mapKey].itm.items = []
        state.data[service][mapKey].itm.totalItems = 0
      }
    },

    saveDepends(state, data) {
      state.depends = { ...state.depends, ...data }
    },

    /**
     * Сохранить промис в beforeSave который выполнится перед сохранением grid
     * @param state
     * @param {Function} promise - метод(promise) который будет выполнен (должен вернуть true / false)
     */
    beforeSaveGrid(state, promise) {
      state.beforeSave = promise
    },

    /**
     * Сохранить метод в afterSave который выполнится после сохранения grid
     * @param state
     * @param {String} com - Название компонента
     * @param {Function} func - метод который будет выполнен
     */
    afterSaveGrid(state, { com, func }) {
      Vue.set(state.afterSave, com, func)
    },

    /**
     * Очистить state.afterSave
     * @param state
     */
    afterSaveGridClear(state) {
      Vue.set(state, 'afterSave', {})
    },

    saveMap(state, { map, path }) {
      let alias = store.getters.url(path).alias
      Vue.set(state.maps, alias, map)
    },

    saveMapQueryFunc(state, func) {
      state.mapQueryFunc = func
    }
  },
  actions: {
    saveItem(store, data) {
      store.commit('createComponentState', data)
      store.commit('saveItem', data)
    },

    saveItems(store, data) {
      store.commit('createComponentState', data)
      store.commit('saveItems', data)
    }
  },
  getters: {
    /**
     * @todo В данный момент не используется!
     *Директивы для полей:
     * Режимы(mode):
     * - HIDE: Если value === {hide} - return false (скрыть поле)
     * @param state
     * @param getters
     * @return {function(*): boolean}
     */
    fieldDirective: (state, getters) => (val, mode = 'hide') => {
      if (mode === 'hide') {
        return val !== '{hide}'
      }

      return true
    }
  }
}
