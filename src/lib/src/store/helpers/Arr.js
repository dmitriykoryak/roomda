import Sortable from 'sortablejs'

export default {
  name: 'Arr',
  getters: {
    arrDiff: () => (a1, a2) => {
      return a1
        .filter(i => a2.indexOf(i) < 0)
        .concat(a2.filter(i => a1.indexOf(i) < 0))
    },

    /**
     * Сравнить 2 массива
     * вернуть true если равны
     * @return {boolean)
     */
    arrCompare: () => (a1, a2) => {
      return a1.length == a2.length && a1.every((v, i) => v === a2[i])
    },

    /**
     * Вернуть сумму элементов массива
     * @returns {number}
     */
    arrSum: () => array => {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum
    },

    /**
     * DragAndDrop сортировка по id
     * {DOM elem} wrapper - DOM селектор wrapper элементов для сортировки
     * {String} apiUrl - url для отправки sort
     * {Object} context - контекст компонента
     * {String} itemsAttr - атрибут сортируемых items в контексте компонента
     * {String} handleSelector - DOM селектор для перетягивания
     * */
    defaultSortInit: (state, getters) => (
      wrapper,
      apiUrl,
      context,
      itemsAttr,
      handleSelector = null
    ) => {
      if (!wrapper) return

      let config = {
        animation: 150,
        ghostClass: 'sort-drop',
        onEnd({ newIndex, oldIndex, item }) {
          if (newIndex === oldIndex) return

          let idBefore = null
          let delIndex = null
          if (oldIndex > newIndex) {
            idBefore =
              (context[itemsAttr][newIndex - 1] &&
                context[itemsAttr][newIndex - 1].id) ||
              ''
            delIndex = oldIndex + 1
          } else {
            idBefore = context[itemsAttr][newIndex].id
            delIndex = oldIndex
          }

          const data = {
            id: context[itemsAttr][oldIndex].id,
            idBefore: idBefore
          }
          getters.query.get(apiUrl + '/sort', data, false, true).then(() => {
            const insert = (arr, index, newItem) => [
              // part of the array before the specified index
              ...arr.slice(0, index),
              // inserted item
              newItem,
              // part of the array after the specified index
              ...arr.slice(index)
            ]

            context[itemsAttr] = insert(
              context[itemsAttr],
              newIndex,
              context[itemsAttr][oldIndex]
            )
            context[itemsAttr].splice(delIndex, 1)
          })
        }
      }

      if (handleSelector) {
        config = { ...config, handle: handleSelector }
      }

      return Sortable.create(wrapper, config)
    }
  }
}
