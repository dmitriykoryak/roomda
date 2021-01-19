<template>
  <v-container
    class="fill-height align-center justify-center"
    :style="{ position: 'relative' }"
  >
    <v-alert
      v-if="flashMsg"
      colored-border
      type="info"
      :style="{ position: 'absolute', top: '30px', width: '96%' }"
      class="info--text"
      outlined
    >
      {{ flashMsg }}
    </v-alert>

    <login-form
      ref="loginForm"
      class="login-form"
      :login.sync="login"
      :pass.sync="pass"
      @click:login="logIn"
    />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  inject: ["$validator"],
  created() {
    document.title = "Логин";
  },

  mounted() {
    if (this.loggedIn) {
      this.$router.push({ name: "main" });
    }
    this.flashMsg = this.flash;
    this.$store.commit("updateFlash", null);
  },

  data: () => ({
    login: null,
    pass: null,
    title: "Вход пользователя",
    flashMsg: null,
  }),

  methods: {
    /**
     * login
     * @param by
     * @return {Promise<void>}
     */
    async logIn(by = null) {
      let params;

      if (by) {
        params = { svc: by };
      } else {
        const validate = await this.$validator.validateAll();
        if (!validate) return;

        params = {
          login: this.login,
          pass: this.pass,
          dId: this.deviceInfo.uuid,
          ua: this.deviceInfo.ua,
          FCMToken: this.deviceInfo.FCMToken,
          appAccountId: this.$config.appAccountId,
        };
      }

      const response = await this.query.post(
        this.$config.api.url.auth + "/user/auth/login",
        params,
        true,
        [],
        this
      );

      if (response.data.success === true) {
        if (this.$refs.loginForm.loginOnPass) {
          const urlParts = response.data.data.url.split("=");
          this.$router.push({
            name: "main",
            query: { t: urlParts[1] },
          });
          this.$store.dispatch("login");
        } else {
          this.$router.push({
            name: "sms",
            query: { userId: response.data.data.userId },
          });
        }
      }
    },
  },

  computed: {
    ...mapState(["flash"]),
    ...mapGetters(["query", "deviceInfo", "loggedIn"]),
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  margin-top: 105px;
}
</style>
