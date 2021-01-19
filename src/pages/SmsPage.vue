<template>
  <SmsCheck no-pin :successTo="{ name: 'main' }"></SmsCheck>
</template>

<script>
import SmsCheck from "~~/components/pin/SmsCheck";
export default {
  components: {
    SmsCheck,
  },
  created() {
    document.title = "Подтверждение регистрации по СМС";
  },
};
</script>

<style lang="scss" scoped></style>
