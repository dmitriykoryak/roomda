export default {
  name: 'Str',
  getters: {
    /**
     * Вернуть строку - 1 буква заглавная
     * @returns {string}
     */
    firstUpperCase: () => str => {
      return str.charAt(0).toUpperCase() + str.substr(1)
    },

    /**
     * Вернуть строку - 1 буква строчная
     * @returns {string}
     */
    firstLowerCase: () => str => {
      if (!str) return str
      return str.charAt(0).toLowerCase() + str.substr(1)
    }
  }
}
