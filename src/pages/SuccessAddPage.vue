<template>
  <v-container>
    <v-alert outlined type="success" text class="mt-12">
      Ваше объявление принято в обработку
    </v-alert>
    <v-btn color="success" class="float-right mt-12" :to="{ name: 'main' }"
      >Вернуться на главную</v-btn
    >
  </v-container>
</template>

<script>
export default {
  created() {
    document.title = "Объявление принято в обработку";
  },
};
</script>
