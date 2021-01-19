<template>
  <v-container class="fill-height flex-column align-center justify-center">
    <div class="pa-4 text-center">
      <v-icon class="mb-4" size="100" color="success">event_available</v-icon>
      <h3 class="title font-weight-light">
        <div class="font-weight-bold">
          Оплата прошла успешно
        </div>
        в ближайшее время с вами свяжется наш менеджер
      </h3>
      <span class="caption grey--text">Спасибо за заказ!</span>
    </div>
    <v-btn color="success" :to="{ name: 'realtysaleList' }"
      >Перейти к Объектам</v-btn
    >
  </v-container>
</template>

<script>
export default {
  created() {
    document.title = "Успешная оплата";
  },
};
</script>
