export default {
  name: 'DOM',
  getters: {
    /**
     * Вернуть количество пикселей высоты прокрутки до верхнего края окна
     * Кроссбраузерное решение
     * */
    getScrollTop: () => () => {
      if (typeof pageYOffset != 'undefined') {
        //most browsers except IE before #9
        return pageYOffset
      } else {
        let B = document.body //IE 'quirks'
        let D = document.documentElement //IE with doctype
        D = D.clientHeight ? D : B
        return D.scrollTop
      }
    }
  }
}
