import Vue from 'vue'
import config from '@/config/config'
import VeeValidate from 'vee-validate'
import dictionaryRu from 'vee-validate/dist/locale/ru'

export default {
  name: 'SetState',
  state: {
    //Обьект данных приложения
    set: {},
    // списки для select и др. - сохраняются lists[firstListKey][secondListKey]
    lists: {}
  },
  mutations: {
    createComponentState(state, { mapKey, service = config.service }) {
      if (!state.set[service] || !state.set[service][mapKey]) {
        const emptyData = {
          [mapKey]: {
            headersFull: [],
            headers: [],
            labels: {},
            rules: {},
            lists: {},
            coms: {},
            sort: {},
            fastfilter: {},
            struc: {},
            sums: {},
            groups: null
          }
        }
        Vue.set(state.set, service, { ...state.set[service], ...emptyData })
      }
    },

    /**
     * Удалить lists по ключу firstListKey
     */
    delListsByFirstListKey(state, firstListKey) {
      if (state.lists[firstListKey]) {
        state.lists[firstListKey] = {}
      }
    },

    saveSet(state, { mapKey, set, service = config.service }) {
      const savedSet = {
        ...((state.set[service] && state.set[service][mapKey]) || {}),
        ...set
      }
      Vue.set(state.set[service], mapKey, savedSet)
    },

    saveList(state, { firstListKey, secondListKey, data }) {
      const savedData = {
        ...state.lists[firstListKey],
        [secondListKey]: data
      }
      Vue.set(state.lists, firstListKey, savedData)
    }
  },

  actions: {
    /**
     * Получить set и lists по сету
     */
    async prepSetList(
      { dispatch },
      { apiUrl, params, mapKey, reload, excludedAttrs, parentAttr }
    ) {
      await dispatch('fetchSet', {
        url: apiUrl,
        params,
        mapKey,
        reload,
        parentAttr
      })
      dispatch('fetchLists', {
        mapKey,
        apiUrl,
        excludedAttrs
      })
    },

    async fetchSet(
      { state, dispatch, getters },
      {
        url = config.api.url.crm,
        params,
        mapKey,
        reload,
        $vuetify,
        parentAttr,
        service = config.service
      }
    ) {
      if (
        reload ||
        Vue._.isEmpty(
          state.set[service] &&
            state.set[service][mapKey] &&
            state.set[service][mapKey].labels
        )
      ) {
        const response = await getters.query.get(
          url + '/' + mapKey + '/set',
          { ...config.api.params.get, ...params },
          true,
          false,
          null,
          false,
          true
        )
        dispatch('saveSet', {
          mapKey,
          set: response.data.data,
          $vuetify,
          parentAttr,
          service
        })
      }
    },

    saveSet(
      { commit, getters },
      { mapKey, set, $vuetify, parentAttr, service = config.service }
    ) {
      let headers = []
      let rules = {}
      let type
      let label
      let sortable
      // заполнить массив правил для валидации сконвертировав их из правил API в правила для VeeValidate
      if (set.rules) {
        rules = getters.convertRules(set.rules)
      }

      // Сохранить depends
      if (set.depends) {
        commit('saveDepends', set.depends)
      }

      // Получить attributeLabels для header
      if (set.struc) {
        for (let [attr, inner] of Object.entries(
          set.struc.index || set.struc.create || set.struc.update
        )) {
          if (attr === parentAttr) {
            continue
          }

          let isTooltip = set.tooltips && set.tooltips[attr] !== undefined

          if (typeof inner === 'object') {
            type = 'composite'
            label = attr
            sortable = false
          } else {
            type = 'simple'
            label = set.labels[attr]
            sortable = set.sort && set.sort.attrs.includes(attr)
          }

          // Заполнить header
          headers.push({
            label: label,
            attr: attr,
            text:
              isTooltip && !($vuetify && $vuetify.breakpoint.xs) ? '' : label,
            value: attr,
            type: type,
            sortable: sortable
          })
        }
      }

      headers.push({
        attr: 'actions',
        value: 'actions',
        text: '',
        sortable: false
      })

      const savedSet = {
        headersFull: headers,
        headers: headers,
        labels: set.labels,
        rules: rules,
        lists: set.lists || {},
        tooltips: set.tooltips || {},
        coms: set.coms || {},
        fastfilter: set.fastfilter,
        sort: set.sort,
        struc: set.struc,
        sums: set.sums,
        groups: set.groups
      }

      // добавить labels в dictionary Validator
      VeeValidate.Validator.localize('ru', {
        ...dictionaryRu,
        attributes: set.labels
      })

      commit('createComponentState', { mapKey })
      commit('saveSet', { mapKey, set: savedSet, service })
    },

    /**
     * Получить/Запросить все списки(lists) атрибуты которых пришли в set.lists
     * @param {Array} excludedAttrs - исключить атрибуты из запроса
     * */
    async fetchLists(
      { dispatch, getters },
      { mapKey, apiUrl, excludedAttrs = [] }
    ) {
      const listsInSet = getters.listsInSet(mapKey)
      if (!listsInSet) return

      let promises = []
      for (let attr in listsInSet) {
        if (!excludedAttrs.includes(attr)) {
          promises.push(dispatch('fetchList', { mapKey, apiUrl, attr }))
        }
      }
      await Promise.all(promises)
    },

    /**
     * Получить/Запросить зависимые списки(lists) для всех значений списков, встречающихся элементах массива items
     * @param {Array} excludedAttrs - исключить атрибуты из запроса
     * */
    async fetchDepLists(
      { dispatch, getters },
      { mapKey, apiUrl, items, excludedAttrs = [] }
    ) {
      const listsInSet = getters.listsInSet(mapKey)
      if (!listsInSet || !items) return

      for (let item of items) {
        for (let attr in listsInSet) {
          if (
            getters.isDepList(mapKey, attr) &&
            !excludedAttrs.includes(attr)
          ) {
            await dispatch('fetchList', { mapKey, apiUrl, attr, item })
          }
        }
      }
    },

    /**
     * Перезапросить list с атрибутом attr
     * */
    reloadList(
      { dispatch },
      { mapKey, apiUrl = config.api.url.crm, attr, item = {} }
    ) {
      dispatch('fetchList', {
        mapKey: mapKey,
        apiUrl: apiUrl,
        attr: attr,
        reload: true,
        item: item
      })
    },

    /**
     * Получить list с атрибутом attr
     * */
    async fetchList(
      { state, commit, getters },
      {
        mapKey,
        apiUrl = config.api.url.crm,
        attr,
        item = {},
        reload = false,
        addParams = {}
      }
    ) {
      let resetIter = false

      const listInSet = getters.listInSet(mapKey, attr)
      if (!listInSet) return

      const firstListKey = getters.getFirstListKey(mapKey, attr)
      const secondListKey = getters.getSecondListKey(mapKey, attr, item)
      const curList =
        state.lists[firstListKey] && state.lists[firstListKey][secondListKey]

      // если:
      // - есть curList.items или
      // - нет api url для list
      // то return;
      if (!reload && curList && curList.items) {
        return
      }
      // если get-depends, а item еще нет - то запрос не делаем
      // а сохраняем list с пустыми curList.items
      //для того чтобы в дальнейшем знать что этот input -> список
      if (listInSet['get-depends'] && Vue._.isEmpty(item)) {
        return
      }

      let response
      if (listInSet.url) {
        let params = {}
        if (listInSet['get-depends']) {
          for (let [depAttr, depApiAttr] of Object.entries(
            listInSet['get-depends']
          )) {
            let depValue = item[depAttr]
            // если значения зависимости нет - пропустить инерацию запроса
            if (!depValue) {
              resetIter = true
            }
            Vue.set(params, [depApiAttr], depValue)
          }
        }

        // если resetIter = true - пропустить инерацию запроса
        if (resetIter) {
          return
        }

        if (listInSet['get']) {
          for (let [depApiAttr, depValue] of Object.entries(listInSet['get'])) {
            params = { ...params, [depApiAttr]: depValue }
          }
        }

        let url = /http/.test(listInSet.url)
          ? listInSet.url
          : apiUrl + '/' + listInSet.url

        response = await getters.query.get(
          url,
          { ...params, ...addParams },
          true,
          !reload
        )
      }

      const items = (response && response.data.data) || listInSet.items
      // create itemsDepth1 - list items без вложенности для упрощения поиска по id-------
      // @TODO Переписать этот мусор!!!
      let itemsDepth1 = {}
      let itemsDepth01 = {}
      if (items) {
        for (let [key, item] of Object.entries(items)) {
          itemsDepth1 = {
            ...itemsDepth1,
            [key]: {
              label: item.label,
              name_case: item.name_case,
              color: item.color,
              address: item.address
            }
          }
          if (item.items) {
            for (let [k, itm] of Object.entries(item.items)) {
              itemsDepth1 = { ...itemsDepth1, [k]: itm }
              itemsDepth01 = { ...itemsDepth01, [k]: itm }
            }
          }
        }
      } //----------------------------------------------------------------

      const savedData = {
        url: listInSet.url,
        'get-depends': listInSet['get-depends'],
        depends: listInSet.depends,
        items: items || {},
        itemsDepth1: itemsDepth1,
        itemsDepth01: itemsDepth01
      }

      commit('saveList', {
        firstListKey: firstListKey,
        secondListKey: secondListKey,
        data: savedData
      })
    },

    /**
     * @TODO Пока не работает!!! Если не понадобится - удалить
     * - Вернуть id по значению(label) в списке
     * - Если такого списка нет и он является зависимым(содержит get-depends в listInSet) - запросить зависимый список и вернуть id по по значению
     * */
    async fetchIdByLabel(
      { dispatch, getters },
      { mapKey, apiUrl, attr, label, item }
    ) {
      let id = getters.getIdByLabel(mapKey, attr, label)

      //Если id все еще не найден проверить является ли список зависимым и запросить зависимый список ---------
      if (!id) {
        if (getters.isDepList(mapKey, attr)) {
          await dispatch('fetchList', {
            mapKey,
            apiUrl,
            attr,
            item
          })
          id = getters.getIdByLabel(mapKey, attr, label)
        }
      } // -------------------------------------------------------------------
      return id
    }
  },

  getters: {
    listsInSet: ({ set }) => mapKey => {
      return (
        set &&
        set[config.service] &&
        set[config.service][mapKey] &&
        set[config.service][mapKey].lists
      )
    },

    listInSet: (state, getters) => (mapKey, attr) => {
      const listsInSet = getters.listsInSet(mapKey)
      return listsInSet && listsInSet[attr]
    },

    /**
     * Проверить является ли attr - атрибутом списка
     * */
    isList: (state, getters) => (mapKey, attr) => {
      const listInSet = getters.listInSet(mapKey, attr)
      return listInSet && !!listInSet.url
    },

    /**
     * Проверить является ли attr - зависимым(от другого списка) атрибутом списка
     * */
    isDepList: (state, getters) => (mapKey, attr) => {
      const listInSet = getters.listInSet(mapKey, attr)
      return listInSet && !!listInSet['get-depends']
    },

    /**
	 * Получить обьект list для текущего attr и item вида:
		{
			url: ...,
			'get-depends': ...,
			depends: ...,
			items: ...,
            itemsDepth1: ...
		}
	 * */
    getList: ({ lists }, getters) => (mapKey, attr, item = {}) => {
      const firstListKey = getters.getFirstListKey(mapKey, attr)
      return (
        lists &&
        lists[firstListKey] &&
        lists[firstListKey][getters.getSecondListKey(mapKey, attr, item)]
      )
    },

    /**
     * Получить ListItem из обьекта списка
     * Если listId - массив: взять первый id
     * @param {String} attr
     * @param {Number} listId
     * @param {Object} item
     * @param {Any} def - Значение, возвращаемое по умолчанию
     * @return {Object}
     * */
    getListItem: (state, getters) => (
      mapKey,
      attr,
      listId,
      item = {},
      def = { label: 'Не указано' }
    ) => {
      const list = getters.getList(mapKey, attr, item)
      return (list && list.itemsDepth1[listId]) || def
    },

    /**
     * Алиас для геттера getListItem
     */
    listItem: (state, getters) => (
      mapKey,
      attr,
      item = {},
      def = { label: 'Не указано' }
    ) => {
      return getters.getListItem(mapKey, attr, item[attr], item, def)
    },

    /**
     * Получить label из ListItem (элемента списка)
     */
    getListLabel: (state, getters) => (
      mapKey,
      attr,
      listId,
      item = {},
      def
    ) => {
      return getters.getListItem(mapKey, attr, listId, item, def).label
    },

    /**
     * Алиас для геттера getListLabel
     */
    listLabel: (state, getters) => (mapKey, attr, item = {}, def) => {
      return getters.getListLabel(mapKey, attr, item[attr], item, def)
    },

    getFirstListItem: (state, getters) => (mapKey, attr, item = {}) => {
      // _.findKey - lodash получить первый ключ в обьекте
      const firstKey = Vue._.findKey(item[attr])
      return getters.getListItem(mapKey, attr, item[attr][firstKey], item)
    },

    /**
     * Получить весь слитый список по атрибуту не зная id
     * Например если есть список с secondListKey: 'city_id-13' и 'city_id-23'
     * То по атрибуту city_id получить слитый список этих двух списков: [{id -> label}, ...]
     * */
    getMergedList: ({ lists }, getters) => (mapKey, attr) => {
      let out = {}
      const firstListKey = getters.getFirstListKey(mapKey, attr)
      const halfSecondListKey = getters.getSecondListKey(mapKey, attr)

      for (let [secondListKey, list] of Object.entries(lists[firstListKey])) {
        if (secondListKey.indexOf(halfSecondListKey) !== -1) {
          out = { ...out, ...list }
        }
      }
      return out
    },

    /**
     * Вернуть id по значению(label) в списке
     * @return {Number, String}
     * */
    getIdByLabel: (state, getters) => (mapKey, attr, label) => {
      let list = getters.getList(mapKey, attr)
      if (!list) {
        list = getters.getMergedList(mapKey, attr)
      }

      if (!list) return

      return Object.keys(list.itemsDepth1).find(
        key => list.itemsDepth1[key].label === label
      )
    },

    /**
     * Создать ключ по которому будет хранится list в state.SetState.lists[firstListKey][secondListKey]
     * Ключ создается из первых двух частей url в listInSet (это сделано чтобы при изменении значений списка очищать список по firstListKey === mapKey)
     * @return {String}
     * */
    getFirstListKey: (state, getters) => (mapKey, attr) => {
      const listInSet = getters.listInSet(mapKey, attr)
      const apiUrl = listInSet && listInSet.url

      if (apiUrl) {
        const parts = apiUrl.split('/')
        return parts[0] + '/' + parts[1]
      }
    },

    /**
     * Создать ключ по которому будет хранится list в state.SetState.lists[firstListKey][secondListKey]
     * Пример attr = city_id, depAttr = region_id, depValue = 23 ------> city_id-region_id=23
     * @return {String}
     * */
    getSecondListKey: (state, getters) => (mapKey, attr, item = {}) => {
      let out = attr
      const listInSet = getters.listInSet(mapKey, attr)

      if (listInSet) {
        if (listInSet['get']) {
          for (let depAttr in listInSet['get']) {
            out += '-' + listInSet['get'][depAttr] + '=' + (item[depAttr] || '')
          }
        }
        if (listInSet['get-depends']) {
          for (let depAttr in listInSet['get-depends']) {
            out +=
              '-' +
              listInSet['get-depends'][depAttr] +
              '=' +
              (item[depAttr] || '')
          }
        }
      }
      return out
    },

    getSet: state => mapKey => {
      return (
        (state.set &&
          state.set[config.service] &&
          state.set[config.service][mapKey]) ||
        {}
      )
    }
  }
}
