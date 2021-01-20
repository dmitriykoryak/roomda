<template>
  <span>
    <v-btn
      v-if="value"
      class="grey lighten-4 font-weight-bold da-phone-button"
      v-bind="afterBindAttrs"
      @click="call(value)"
      ><v-icon small left color="green">phone</v-icon
      >{{ value | formatPhone }}</v-btn
    >
    <slot
      name="before"
      v-else
      v-bind="{ on: { click: onClick }, bind: { loading: loading } }"
    >
      <v-btn
        v-bind="beforeBindAttrs"
        @click="onClick"
        :loading="loading"
        class="da-phone-button"
        >{{ title }}</v-btn
      >
    </slot>
  </span>
</template>

<script>
// Кнопка, по клику делающая запрос за телефоном
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false
    }
  },

  props: {
    value: Number,
    apiUrl: {
      type: String,
      required: true
    },
    params: Object,
    title: {
      type: String,
      default: 'Показать телефон'
    },
    beforeBindAttrs: Object,
    afterBindAttrs: Object
  },

  methods: {
    async onClick() {
      if (this.loggedIn) {
        const phone = await this.fetchPhone()
        if (!phone) {
          // Роут на который необходимо перейти, если API не вернул телефон пользователя
          this.$router.push({ name: 'pay' })
        }
      } else {
        this.$router.push({ name: 'login' })
        this.$store.commit(
          'updateFlash',
          'Чтобы получить бесплатные варианты объектов - авторизуйтесь'
        )
      }
    },
    async fetchPhone() {
      this.loading = true
      const response = await this.query.get(this.apiUrl, this.params)
      const phone = response.data.data && response.data.data[0]
      this.$emit('input', phone)
      this.loading = false
      return phone
    }
  },

  computed: mapGetters(['query', 'loggedIn', 'call'])
}
</script>

<style lang="scss" scoped></style>
