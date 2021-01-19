export default {
  name: 'Color',
  getters: {
    /**
     * Hex в RGB / RGBA
     * @param {Number} alfa - прозрачность
     * @returns {string}
     */
    hexToRGB: () => (h, alfa = null) => {
      let r = 0,
        g = 0,
        b = 0

      // 3 digits
      if (h.length == 4) {
        r = '0x' + h[1] + h[1]
        g = '0x' + h[2] + h[2]
        b = '0x' + h[3] + h[3]

        // 6 digits
      } else if (h.length == 7) {
        r = '0x' + h[1] + h[2]
        g = '0x' + h[3] + h[4]
        b = '0x' + h[5] + h[6]
      }

      if (alfa) {
        return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + +alfa + ')'
      } else {
        return 'rgb(' + +r + ',' + +g + ',' + +b + ')'
      }
    },

    /**
     * Вернуть случайный цвет в формате HEX
     * @returns {string}
     */
    randColor: state => () => {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
