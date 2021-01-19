import config from '@/config/config'
import $router from '@/router.js'

/**
 * Модуль Vuex для управления нативными функциями моб. устройств с помощью. плагинов Cordova
 */
export default {
  name: 'Cordova',

  state: {
    firebase: {
      token: null,
      serverKey:
        'AAAApyPvJyk:APA91bHk9klaD9q1x73yNEGgSiw4ow0vwyQdIyY3l03dVf9S7BzQhK7aRcISBqvNoR2TRKKNGyt2H7dyxmGTWMyf4hk2Co-PSxxshf-NdjuDAl6j4grQfEVsQIjTXrN3zHN4X4me1cVg'
    },
    // {Boolean} требуется ли обновление (true - если устарела версия приложения)
    oldAppVersion: false
  },

  mutations: {
    /**
     * Сохранить firebase token
     */
    saveFirebaseToken(state, token) {
      state.firebase.token = token
    }
  },

  actions: {
    async mobileAppInit({ state, commit, getters }, data) {
      const {
        checkVersion = false,
        noInetMessage = 'Для работы программы необходимо включить интернет'
      } = data || {}
      // для корректного старта мобильных приложений и PWA необходимо после загрузки приложения произвести редирект на существующий роут, например '/'
      //   if (
      //     (getters.isAndroid || getters.isIos) &&
      //     $router.currentRoute.path !== '/'
      //   ) {
      //     $router.push('/')
      //   }

      if (!getters.isMobileApp) return

      // проверка наличия интернета --------------------------
      document.addEventListener('deviceready', () => {
        $router.push('/')
        // проверка наличия интернета
        const networkState = navigator.connection.type
        if (networkState === Connection.NONE) {
          commit('DaSnackbar/show', {
            text: noInetMessage
          })
        }
        // при включении Интернета - перерендерить приложение
        document.addEventListener('online', e => commit('reRenderApp'), false)
        // ------------------------------------------------------

        // Корекция Viewport для ios (пока не требуется: в Roomda все сильно мелкое) ---------------------------
        // let sc = document.createElement('meta')
        // sc.setAttribute('name', 'viewport')
        // if (getters.deviceInfo.platform === 'iOS') {
        //   sc.setAttribute(
        //     'content',
        //     'user-scalable=no, initial-scale=0.7, maximum-scale=1, minimum-scale=0.7, width=device-width, height=device-height, target-densitydpi=device-dpi'
        //   )
        // }
        // document.head.appendChild(sc)
        // ------------------------------------------------------

        // Firebase Cloud Messaging ---------------------------------------------
        if (!window.cordova.plugins.firebase) return
        // Получить токен приложения
        window.cordova.plugins.firebase.messaging.getToken().then(token => {
          console.log('Got app token: ', token)
          commit('saveFirebaseToken', token)
        })
        // Показать snackbar с сообщением - если пришло push уведомление во время работы приложения
        window.cordova.plugins.firebase.messaging.onMessage(payload => {
          console.log('New foreground FCM message:')
          commit('DaSnackbar/show', { text: payload.body })
        })
        // ------------------------------------------------------
      })
      // Проверить актуальность версии приложения ---------------------------
      if (!checkVersion) return

      const response = await getters.query.get(
        config.api.url.auth + '/app/version/min',
        { appAccountId: config.appAccountId }
      )
      const curVersion = response.data.data
      // если эмуляция моб устройства
      if (config.emulation.mob) {
        if (curVersion > config.emulation.config.app.version) {
          state.oldAppVersion = true
        }
        // если реальное устройство
      } else {
        cordova.getAppVersion.getVersionCode(version => {
          if (curVersion > version) {
            state.oldAppVersion = true
          }
        })
      }
      // ------------------------------------------------------
    }
  },

  getters: {
    /**
     * Вернуть данные об устройстве:
     * - platform (Android)
     * - uuid: id устройства (57cdba8b0970e0a7)
     * - ua: userAgent (Redmi Note 7)
     * - FCMToken: токен сервиса Firebase (cTwrcHbnwe4:APA91bGBV7h6NI-qEitqjyPbxhN0dytQer4DLTSvlEik7YoMDtxe-Ga1uoPGNNmaFRyF0HC7FrDu8UbftebUrflLspoAB9z9mdd_wjQtjjWPJKcVuSFgplCIsdud9IR2SVHSvpqiqAlV)
     * @param state
     * @param getters
     * @return {{ua: string}|{platform: *, ua: *, dId: *}}
     */
    deviceInfo: (state, getters) => {
      let out
      // если мобильное приложение
      if (getters.isMobileApp && window.device) {
        out = {
          ua: window.device.model,
          platform: window.device.platform,
          uuid: window.device.uuid,
          FCMToken: state.firebase && state.firebase.token
        }
        // если десктоп
      } else {
        let uuid = getters.storage.get('uuid')
        if (!uuid) {
          uuid = getters.randTs()
          getters.storage.set('uuid', uuid)
        }
        out = {
          ua: window.navigator.userAgent,
          uuid: uuid
        }
      }

      if (config.emulation && config.emulation.mob) {
        out = {
          ...out,
          platform: config.emulation.config.deviceInfo.platform,
          uuid: config.emulation.config.deviceInfo.uuid,
          ua: config.emulation.config.deviceInfo.ua,
          FCMToken: config.emulation.config.deviceInfo.FCMToken
        }
      }

      return out
    },

    isAndroid() {
      return navigator.userAgent.indexOf('Android') > 0
    },

    isIos() {
      return (
        navigator.userAgent.indexOf('iPhone') > 0 ||
        navigator.userAgent.indexOf('iPad') > 0 ||
        navigator.userAgent.indexOf('iPod') > 0
      )
    },

    isMobileApp: () => {
      if (
        (config.emulation && config.emulation.mob) ||
        $router.currentRoute.query.m === '1' ||
        (window.cordova && window.cordova.platformId)
      ) {
        return true
      }
      return false
    },

    call: () => phone => {
      if (!window.cordova) return

      cordova.plugins.phonedialer.call(phone, function(err) {
        if (err == 'empty') alert('Неизвестный номер')
        else alert('Ошибка звонка:' + err)
      })
    },

    sms: () => (phone, message, onSuccess = () => {}, onError = null) => {
      if (!window.sms) return
      //CONFIGURATION
      const options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT' // send SMS with the native android SMS messaging
          //intent: '' // send SMS without opening any other app
        }
      }
      if (!onError) {
        onError = function(e) {
          alert('Ошибка отправки сообщения:' + e)
        }
      }
      sms.send(phone, message, options, onSuccess, onError)
    },

    share: () => message => {
      if (!navigator || !navigator.share) return

      navigator.share(message)
    },

    camera: () => {
      return {
        getPicture(onSuccess = () => {}, onError = null, quality = 50) {
          if (!navigator || !navigator.camera) return

          if (!onError) {
            onError = function(e) {
              alert('Failed because: ' + message)
            }
          }
          navigator.camera.getPicture(onSuccess, onError, {
            quality: quality,
            destinationType: Camera.DestinationType.DATA_URL
          })
        }
      }
    },

    geolocation: () => {
      return {
        getCurrentPosition(onSuccess = () => {}, onError = null) {
          if (!navigator || !navigator.geolocation) return

          // onError Callback receives a PositionError object
          if (!onError) {
            onError = function(e) {
              alert(
                'code: ' +
                  error.code +
                  '\n' +
                  'message: ' +
                  error.message +
                  '\n'
              )
            }
          }
          navigator.geolocation.getCurrentPosition(onSuccess, onError)
        }
      }
    }
  }
}
