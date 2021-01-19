<template>
  <v-container>
    <v-alert outlined type="success" text class="mt-12 flex-grow-1">
      Здесь страница <span class="font-weight-bold">Контакты</span>
    </v-alert>
  </v-container>
</template>

<script>
export default {
  created() {
    document.title = "Контакты";
  },
};
</script>

<style lang="scss" scoped></style>
