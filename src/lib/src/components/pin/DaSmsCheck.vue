<template class="sms-check">
  <div>
    <num-wrapper
      class="sms-check"
      :error.sync="error"
      @backspace:click="confirmCodeArr.pop()"
      @num:enter="lockNum ? '' : confirmCodeArr.push($event)"
    >
      <div class="d-flex justify-center align-center flex-grow-1 flex-column">
        <v-slide-y-transition>
          <div class="flex-grow-1">
            <div class="mx-3 mt-12 text-center text-message">
              <div v-if="!error">
                Для совершения операции введите код подтверждения, отправленный
                вам по СМС
              </div>
            </div>
          </div>
        </v-slide-y-transition>
        <div class="d-flex align-center">
          <v-text-field
            class="confirm-input text-center"
            v-mask="'####'"
            v-model="confirmCode"
            readonly
          ></v-text-field>
        </div>

        <div class="send-again mx-12 text-center">
          <div v-if="timer !== 0">
            Запросить код повторно можно через
            <span class="info--text title">{{ timer }}</span> секунд
          </div>
          <v-slide-y-reverse-transition>
            <div v-if="timer === 0">
              <a href="#" class="info--text title" @click="smsResend"
                >отправить еще раз</a
              >
            </div>
          </v-slide-y-reverse-transition>
        </div>

        <div class="mx-12 offer-text text-center">
          Вводя код из СМС, вы соглашаетесь с условиями
          <a
            href="#"
            @click.prevent="
              dialog = true
              getOffer()
            "
            >оферты</a
          >
        </div>
      </div>

      <template v-slot:exit>
        <v-btn v-blur text fab @click="$router.go(-1)"
          ><v-icon>exit_to_app</v-icon>
        </v-btn>
      </template>
    </num-wrapper>

    <!--Модальное окно оферты-->
    <da-dialog v-model="dialog" fullscreen randImg leftArrow title="Оферта">
      <v-card tile>
        <v-card-text class="pt-2" v-html="offer"> </v-card-text>
      </v-card>
    </da-dialog>
    <!--Модальное окно оферты конец-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NumWrapper from './NumWrapper'

export default {
  name: 'sms-check',

  components: { NumWrapper },

  mounted() {
    this.init()
  },

  data: () => ({
    dialog: false,
    offer: null,
    noOfferMessage: 'Извините, оферта находится в стадии разработки',
    // код подтверждения в виде массива
    confirmCodeArr: [],
    // блокировка ввода
    lockNum: false,
    timer: null,
    timerMaxVal: 60,
    error: null
  }),

  props: {
    noPin: Boolean,
    successTo: Object
  },

  methods: {
    init() {
      this.timer = this.timerMaxVal
      --this.timer
    },

    async smsResend() {
      let response = await this.query.post(
        this.$config.api.url.auth + '/out/auth-user-auth/sms-resend',
        {
          userId: this.$route.query.userId
        }
      )
      if (response.data.data) {
        this.$store.commit('DaSnackbar/show', {
          text: 'Sms отправлено на ваш номер телефона'
        })
        this.timer = this.timerMaxVal
      }
    },

    async getOffer() {
      if (this.offer) return

      let response = await this.query.get(
        this.$config.api.url.auth + '/user/auth/offer',
        { appAccountId: 107 }
      )
      this.offer =
        (response.data.data && response.data.data.text) || this.noOfferMessage
    },

    /**
     * Проверить код по api
     */
    async checkCode() {
      this.error = null
      let response = await this.loginUser({
        confirmCode: this.confirmCode,
        noPin: this.noPin,
        errorPropagation: true
      })

      this.error = response.data.data[0] && response.data.data[0].message

      if (this.error) {
        this.reset()
        return
      }

      if (response.data.success) {
        if (response.data.data.to) {
          this.$router.push({
            path: '/' + response.data.data.to,
            query: { userId: response.data.data.userId }
          })
        } else {
          this.authUser({
            token: response.data.data.token,
            successTo: { path: '/' }
          })
        }
      }
      this.reset()
    },

    reset() {
      this.confirmCodeArr = []
      this.lockNum = false
    },

    ...mapActions(['loginUser', 'authUser'])
  },
  computed: {
    // код подтверждения в виде строки
    confirmCode() {
      return this.confirmCodeArr.join('')
    },
    ...mapGetters(['query', 'deviceInfo', 'redirect'])
  },

  watch: {
    timer(val) {
      if (val > 0) {
        setTimeout(() => {
          --this.timer
        }, 1000)
      }
    },

    confirmCodeArr(val) {
      if (val.length === 4) {
        this.lockNum = true
        this.checkCode()
      }
    }
  }
}
</script>

<style lang="scss">
.sms-check {
  .check-info {
    min-height: 70px;
  }

  .text-message {
    min-height: 72px;
  }

  .confirm-input {
    max-width: 56px;

    input {
      padding: 0 10px 0 10px;
    }
  }

  .send-again {
    min-height: 80px;
  }

  .offer-text {
    font-size: 12px;
  }
}
</style>
