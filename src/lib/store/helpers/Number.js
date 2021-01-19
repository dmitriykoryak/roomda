export default {
  name: 'Number',
  getters: {
    /**
     * Проверка на число (в отличие от Lodash.isNumber на строку-число так же возвращает true)
     * @returns {boolean}
     */
    isNumeric: () => val => {
      return (
        !isNaN(val) &&
        typeof val !== 'object' &&
        val != Number.POSITIVE_INFINITY &&
        val != Number.NEGATIVE_INFINITY
      )
    },

    /**
     * Вернуть random number
     * @return {number}
     */
    rand: () => () => Math.floor(Math.random() * 100000),

    /**
     * Вернуть random number с timestamp
     * @return {number}
     */
    randTs: (state, getters) => () => getters.rand() + '-' + Date.now(),

    /**
     * Вернуть true если число нечетное
     * @returns {boolean}
     */
    isEven(n) {
      return n % 2 == 0
    },

    /**
     * Вернуть true если число четное
     * @returns {boolean}
     */
    isOdd: () => number => {
      if (number & 1) {
        return false
      } else {
        return true
      }
    }
  }
}
