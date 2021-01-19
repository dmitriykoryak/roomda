<template>
  <div class="auth-form-wrapper">
    <div class="auth-form-blur"></div>

    <v-card class="auth-form" outlined tile>
      {{ title }}

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'login-wrapper',

  props: {
    title: String
  }
}
</script>

<style lang="scss">
.auth-form-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 150px;
}
.auth-form {
  min-width: 320px;
  padding: 0 10px;
  background: transparent !important;

  &-blur {
    filter: blur(5px) !important;
    min-width: 320px;
    height: 100%;
    position: absolute;
  }

  .v-card__actions {
    justify-content: center;
  }

  .img-login {
    display: flex;
    align-content: center;
    justify-content: center;
    margin-bottom: 50px;
  }
}

@media all and (max-width: 576px) {
  .auth-form {
    width: 100vw;
    .auth-form-toolbar {
      width: auto;
    }

    &-blur {
      min-width: 100%;
    }
  }
}
</style>
