<template>
  <div class="da-balance">
    <v-list-item class="list-item">
      <v-list-item-avatar class="my-0 mr-2">
        <v-icon>account_balance_wallet</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ balance | currency }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn small text tile class="success" @click.stop="dialog = true">
          Пополнить
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <!--  Модальное окно пополнения баланса  -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card tile>
        <v-card-text class="pb-3">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Баланс на счете</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn :loading="loading.balance" icon @click="getBalance">
                  <v-icon>autorenew</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <div class="mr-3">
                <v-icon>account_balance_wallet</v-icon>
              </div>
              <v-list-item-content>
                <v-list-item-title>{{ balance | currency }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action> </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>

            <validation-observer v-slot="{ validate }">
              <form @submit.prevent="validate().then(pay)">
                <validation-provider
                  name="Сумма"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <div
                    class="da-balance-field-wrap d-flex align-center flex-nowrap pa-3"
                  >
                    <v-text-field
                      v-model="cost"
                      v-mask="'#############'"
                      :error-messages="errors[0]"
                      placeholder="Сумма"
                      outlined
                      dense
                      single-line
                      autofocus
                    ></v-text-field>
                    <span class="mx-2">₽</span>
                    <v-spacer></v-spacer>
                    <div>
                      <v-btn
                        :loading="loading.pay"
                        text
                        tile
                        class="success"
                        type="submit"
                      >
                        К оплате
                      </v-btn>
                    </div>
                  </div>
                </validation-provider>
              </form>
            </validation-observer>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  Модальное окно пополнения баланса end  -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'da-balance',
  mounted() {
    this.getBalance()
  },

  data: () => ({
    dialog: false,
    loading: {
      balance: false,
      pay: false
    },
    cost: null
  }),

  methods: {
    async getBalance() {
      if (!this.$config.api.url.pay) return

      this.loading.balance = true
      const response = await this.query.get(
        this.$config.api.url.pay + '/balance/default/user'
      )
      if (response.data.data.sum) {
        this.$store.commit('saveBalance', response.data.data.sum / 100)
      }
      this.loading.balance = false
    },

    async pay() {
      this.loading.pay = true
      const response = await this.query.get(
        this.$config.api.url.pay + '/payment/default/balance',
        { cost: this.cost }
      )
      if (response.data.data.url) {
        window.location.href = response.data.data.url
      }
      this.loading.pay = false
    }
  },

  computed: {
    ...mapState({
      balance: state => state.UserState.balance || '...'
    }),
    ...mapGetters(['query', 'redirect'])
  }
}
</script>

<style lang="scss">
.da-balance-field-wrap {
  .v-input {
    margin-bottom: -30px;
    width: 240px;
  }
}
.da-balance-pay-list-item {
  min-height: 76px;
}

.da-balance {
  .list-item {
    height: 40px;
  }
}
</style>
