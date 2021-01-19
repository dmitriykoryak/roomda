<template>
  <v-container class="fill-height flex-column align-center justify-center">
    <div class="pa-4 text-center">
      <v-icon class="mb-4" size="100" color="error">event_busy</v-icon>
      <h3 class="title font-weight-light">
        <div class="font-weight-bold">
          Ваша оплата НЕ прошла
        </div>
        попробуйте выполнить операцию позже
      </h3>
      <span class="caption grey--text"
        >приносим извенения за доставленные неудобства!</span
      >
    </div>
    <v-btn v-if="loggedIn" color="success" :to="{ name: 'pay' }"
      >Перейти к Оплате</v-btn
    >
    <v-btn v-else color="success" :to="{ name: 'login' }">Вход</v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  created() {
    document.title = "Неудачная оплата";
  },
  computed: mapGetters(["loggedIn"]),
};
</script>
