<template>
  <div>
    <da-dialog
      v-model="dialog"
      title="Приложение"
      randImg
      persistent
      :closeIcon="false"
      maxWidth="600"
    >
      <v-card tile class="pt-4">
        <v-alert dense text type="info" class="mx-3">
          Для просмотра прототипа приложения заполните поля
        </v-alert>

        <validation-observer v-slot="{ validate }">
          <form @submit.prevent="validate().then(send)">
            <v-card-text>
              <validation-provider
                name="Название компании"
                rules="required|max:20"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="name"
                  :error-messages="errors[0]"
                  :counter="20"
                  label="Название компании"
                  prepend-icon="fa-user"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-if="showPhone"
                name="Телефон"
                rules="phone|required"
                v-slot="{ errors }"
              >
                <da-phone-field
                  v-model="phone"
                  :error-messages="errors[0]"
                  label="Телефон"
                  prepend-icon="fa-phone"
                ></da-phone-field>
              </validation-provider>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="ml-2" color="primary" text tile type="submit"
                >Далее</v-btn
              >
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </da-dialog>

    <div id="for-open-from-menu" class="d-none" @click="dialog = true"></div>
  </div>
</template>

<script>
/**
 * Форма промо проверки
 */
import { mapGetters } from 'vuex'

export default {
  name: 'promo-check',

  mounted() {
    if (!this.storage.get('promo-check-name')) {
      this.dialog = true
    } else {
      this.name = this.storage.get('promo-check-name')
      this.phone = this.storage.get('promo-check-phone')
    }

    const phoneInGet = this.$route.query.p
    if (phoneInGet) {
      this.phone = phoneInGet
    }
  },

  data: () => ({
    dialog: false,
    name: null,
    phone: null
  }),

  methods: {
    async send() {
      const params = {
        name: this.name.toString(),
        phoneNumbers: [this.phone],
        from: 'promo-law'
      }
      await this.query.post(
        this.$config.api.url.crm + '/source/order-in/create',
        params
      )
      this.storage.set('promo-check-name', this.name)
      this.storage.set('promo-check-phone', this.phone)
      this.dialog = false
    }
  },

  computed: {
    showPhone() {
      return this.$route.query.p ? false : true
    },
    ...mapGetters(['query', 'storage'])
  }
}
</script>
