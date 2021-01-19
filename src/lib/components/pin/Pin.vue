<template>
  <num-wrapper
    class="pin-reg max-w-100"
    :error.sync="error"
    @backspace:click="pinConfirm.length ? pinConfirm.pop() : pin.pop()"
    @num:enter="pinEnter($event)"
  >
    <div
      class="d-flex justify-center align-center flex-grow-1 flex-column"
      :style="{ marginTop: '120px' }"
    >
      <div class="mb-3 grey--text text--darken-2">
        {{ regMode ? 'Задайте код доступа' : userName }}
      </div>
      <div class="pins d-flex align-center mb-8">
        <div
          v-for="i in 4"
          class="pin"
          :class="{ entered: pin[i - 1] !== undefined }"
        ></div>
      </div>

      <v-slide-y-reverse-transition v-if="regMode">
        <div v-if="showPinConfirm" class="pins d-flex flex-column align-center">
          <div class="mb-3 grey--text text--darken-2">
            Повторите код доступа
          </div>
          <div class="pins d-flex justify-center align-center">
            <div
              v-for="i in 4"
              class="pin"
              :class="{ entered: pinConfirm[i - 1] !== undefined }"
            ></div>
          </div>
        </div>
      </v-slide-y-reverse-transition>
    </div>

    <template v-slot:exit>
      <v-btn v-blur text fab @click="regMode ? '' : $store.dispatch('logout')"
        ><v-icon>exit_to_app</v-icon>
      </v-btn>
    </template>
  </num-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import NumWrapper from './NumWrapper'

export default {
  name: 'pin',
  components: { NumWrapper },
  mounted() {
    this.init()
  },

  data: () => ({
    regMode: false, //режим регистрации Pin
    userName: '',
    phone: null,
    pin: [],
    pinConfirm: [],
    lockNum: false,
    error: null
  }),

  methods: {
    init() {
      if (this.url().alias === 'pin-reg') {
        this.regMode = true
      }

      if (!this.regMode) {
        this.userName = this.storage.get('userName')
      }
    },
    /**
     * Ввод Pin
     * */
    pinEnter(num) {
      if (this.lockNum) return

      if (this.showPinConfirm && this.regMode) {
        this.pinConfirm.push(num)
      } else {
        this.pin.push(num)
      }
    },

    /**
     * Сравнить Pin и pinConfirm для regMode = true
     * отправить данные на Api
     * */
    async comparePins() {
      this.lockNum = true

      const pinStr = this.pin.join('')
      let pinConfirmStr

      if (this.regMode) {
        pinConfirmStr = this.pinConfirm.join('')

        if (pinStr !== pinConfirmStr) {
          this.error = 'Pin и повтор Pin не совпадают'
          this.reset()
          return
        }
      }

      let params = {
        userId: this.$route.query.userId,
        dId: this.deviceInfo.uuid,
        pin: pinStr,
        ua: this.deviceInfo.ua,
        appAccountId:
          this.$route.query.appAccountId || this.$config.appAccountId
      }
      if (this.regMode) {
        params = { ...params, pinConfirm: pinConfirmStr, reg: 1 }
      }

      this.queryToApi(this.$config.api.url.auth + '/user/auth/login', params)
    },

    /**
     * Запрос к Api
     * */
    async queryToApi(url, params) {
      let response = await this.query
        .get(url, params, true, true, null, true)
        .catch(e => {
          // Если ошибка от Api(валидация, тд...)
          let error
          if (
            e.response &&
            e.response.data &&
            e.response.data.data[0] &&
            (error = e.response.data.data[0].message)
          ) {
            this.error = error
          }
          this.reset()
        })

      // Если Pin верный и пришел redirect url
      if (response && response.data.data.url) {
        if (this.regMode) {
          this.storage.set('userId', this.$route.query.userId)
          this.storage.set('pinIsset', 1)
          this.storage.set('userName', this.$route.query.userName)
        }
        this.redirect(response.data.data.url)
      }
      this.reset()
    },

    /**
     * Сброс
     * */
    reset() {
      this.pin = []
      this.pinConfirm = []
      this.lockNum = false
    }
  },
  computed: {
    showPinConfirm() {
      return this.pin.length >= 4
    },
    ...mapGetters([
      'query',
      'deviceInfo',
      'nextYear',
      'url',
      'redirect',
      'storage'
    ])
  },

  watch: {
    pinConfirm: {
      handler(val) {
        if (!this.regMode) return

        if (val.length === 4) {
          this.comparePins()
        }
      },
      deep: true
    },
    pin: {
      handler(val) {
        if (this.regMode) return

        if (val.length === 4) {
          this.comparePins()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.pin-reg {
  .pins {
    .pin {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      background-color: #cccccc;
      margin: 0 10px;

      &.entered {
        background-color: #747474;
      }
    }
  }
}
</style>
