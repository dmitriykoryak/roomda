/**
 * Конфиг приложения: доступ к обьекту конфига в приложении через this.$config
 */
export default {
  /**
   * Api
   */
  api: {
    url: {
      crm: 'http://103.crm.api.t2.bshost.ru',
      media: 'http://6.media.api.t2.bshost.ru',
      realty: 'http://17.realty.api.t2.bshost.ru',
      auth: 'http://1.auth.api.t2.bshost.ru'
    },
    params: {
      required: {
        k: 1,
        t: 1
      },
      list: {
        add: 'count'
      },
      dtEn: {
        'format[dt]': 'datetime-en'
      },
      dateEn: {
        'format[dt]': 'date-en'
      }
    }
  },
  siteHost: 'http://roomda.ru',
  appAccountId: 202,

  /**
   * Значения по умолчанию
   */
  default: {
    routes: {
      login: { name: 'login' }
    }
  },

  /**
   * Моб. устройство
   */
  mobApp: {
    // Домен для получения изображений в моб. приложении
    url: {
      // локальный url приложения в моб. устройстве (для редиректа из браузера в приложение)
      local: {
        202: 'bitapp://crm.localhost.bitsite.ru'
      },
      // Url на всемирных площадках
      // регистр ключей не менять: они(Android, iOS) совпадают с возможными значениями getters.deviceInfo.platform
      Android: {
        202: 'https://play.google.com/store/apps/details?id=net.musoroff.lk'
      },
      iOS: {
        202: 'https://apps.apple.com/us/app/musoroff/id1491894594?l=ru&ls=1'
      }
    }
  },

  /**
   * Эмуляция режимов:
   * emulation.mob = true - эмуляция мобильного устройства
   * emulation.config - настройки мобильного устройства и платформы в режиме эмуляции мобильного устройства
   **/
  emulation: {
    mob: false,
    config: {
      app: {
        version: 10001
      },
      deviceInfo: {
        uuid: '57cdba8b0970e0a7',
        platform: 'Android',
        ua: 'Redmi Note 7',
        FCMToken:
          'cTwrcHbnwe4:APA91bGBV7h6NI-qEitqjyPbxhN0dytQer4DLTSvlEik7YoMDtxe-Ga1uoPGNNmaFRyF0HC7FrDu8UbftebUrflLspoAB9z9mdd_wjQtjjWPJKcVuSFgplCIsdud9IR2SVHSvpqiqAlV'
      }
    }
  }
}
