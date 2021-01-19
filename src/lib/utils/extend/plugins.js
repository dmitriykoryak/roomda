/**
 * Подключение plugins и настрока конфигурации
 */

import Vue from 'vue'

import VeeValidate from 'vee-validate'
import dictionaryRu from 'vee-validate/dist/locale/ru'
const veeValidateOptions = {
  // events: 'blur',
  inject: false
  //   dictionary: {
  //     ru: dictionaryRu
  //   }
}
Vue.use(VeeValidate, veeValidateOptions)
VeeValidate.Validator.localize('ru', dictionaryRu)

import VueConfig from 'vue-config'
import Config from '@/config/config'
Vue.config.productionTip = false
Vue.use(VueConfig, Config)

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

/**
 * Плагин для вывода Денежного формата
 * пример использования: val | currency
 */
import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter, {
  symbol: '₽',
  thousandsSeparator: ' ',
  fractionCount: 0,
  fractionSeparator: ' ',
  symbolPosition: 'back',
  symbolSpacing: true
})

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

import VueLodash from 'vue-lodash'
import lodash from 'lodash'
Vue.use(VueLodash, { lodash: lodash })

const moment = require('moment')
require('moment/locale/ru')
Vue.use(require('vue-moment'), {
  moment
})

/**
 * Расширение экземпляра Vue
 * -------------------------
 *
/**
     * Преобразовать path статических ресурсов если mobile Application
     */
Vue.prototype.$conv = (path, isSlash = false) => {
  if (!window.cordova) return (isSlash ? '/' : '') + path

  if (navigator.userAgent.indexOf('Android') > -1) {
    return 'file:///android_asset/www/' + path
  } else {
    return 'cdvfile://localhost/bundle/www/' + path
  }
}
