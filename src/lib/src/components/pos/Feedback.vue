<template>
  <v-btn icon @click="dialog = true">
    <v-icon>local_phone</v-icon>

    <da-dialog
      v-model="dialog"
      title="Форма обратной связи"
      randImg
      maxWidth="600"
    >
      <v-card class="pt-4" tile>
        <validation-observer v-slot="{ validate }">
          <form @submit.prevent="validate().then(send)">
            <v-card-text>
              <validation-provider
                name="Телефон"
                rules="phone|required"
                v-slot="{ errors }"
              >
                <da-phone-field
                  v-model="companyPhone"
                  :error-messages="errors[0]"
                  label="Телефон"
                  prepend-icon="fa-phone"
                ></da-phone-field>
              </validation-provider>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="ml-2" color="primary" text tile type="submit"
                >Отправить</v-btn
              >
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </da-dialog>
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'feedback',

  data: () => ({
    companyPhone: null,
    dialog: false
  }),

  methods: {
    async send() {
      const params = {
        phoneNumbers: [this.companyPhone],
        from: 'feedback',
        name: 'feedback'
      }
      await this.query.post(
        this.$config.api.url.crm + '/source/order-in/create',
        params
      )
      this.companyPhone = null
      this.dialog = false
      this.$store.commit('DaSnackbar/show', {
        text:
          'Сообщение отправлено, в ближайшее время с Вами свяжется наш сотрудник'
      })
    }
  },

  computed: {
    ...mapGetters(['query'])
  }
}
</script>
