export default {
  name: 'Obj',
  getters: {
    /**
     * Использовать из Lodash:
     * _.isEmpty(val)
     */

    /**
     * Длина обьекта
     * @return {function(*): number}
     */
    objSize: () => (obj) => {
      let size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },

    /**
     * Вернуть глубину обьекта
     * @param state
     * @param getters
     * @return {function(*): number}
     */
    objDepth:  (state, getters) => (obj) => {
      let depth = 1;
      let key;
      for(key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if(typeof obj[key] == 'object'){
          let localDepth = getters.objDepth(obj[key]) + 1;
          depth = Math.max(localDepth, depth);
        }
      }
      return depth;
    },

    /**
     * Найти ключ по значению
     * */
    getKeyByValue:  (state, getters) => (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    },
  }
}
