<template>
  <div>
    <slot v-if="renderComs"></slot>
  </div>
</template>
<script>
/**
 * Компонент проверки авторизации пользователя
 * - если в route указан meta.requiresAuth = true - запретит открытие роута и выполнит User.logoutUser()
 * - если при этом в route указан meta.noAuthMessage - покажет открытие snackbar сообщение
 */
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  created() {
    this.routerEvents()
    this.tryAuth()
  },
  data() {
    return {
      renderComs: false
    }
  },
  methods: {
    async tryAuth() {
      if (
        this.isRequiresAuthRoute(this.$route) &&
        !(await this.isAuthenticated())
      ) {
        this.showNoAuthMessage(this.$route)
        this.logoutUser()
      } else {
        await this.authUser()
      }
      this.$nextTick(() => (this.renderComs = true))
    },
    routerEvents() {
      this.$router.beforeEach(async (to, from, next) => {
        // этот путь требует авторизации, проверяем залогинен ли
        // пользователь, и если нет, перенаправляем на страницу логина
        if (this.isRequiresAuthRoute(to) && !(await this.isAuthenticated())) {
          this.logoutUser()
          this.showNoAuthMessage(to)
        } else {
          next()
        }
      })
    },
    showNoAuthMessage(to) {
      if (to.meta && to.meta.noAuthMessage) {
        this.snackbarShow({
          text: to.meta.noAuthMessage,
          color: 'info',
          icon: 'info',
          hideBtn: true
        })
      }
    },
    isRequiresAuthRoute(to) {
      return to.matched.some(route => route.meta && route.meta.requiresAuth)
    },
    async isAuthenticated() {
      return this.loggedIn || (!this.loggedIn && (await this.authUser()))
        ? true
        : false
    },
    ...mapMutations({
      snackbarShow: 'DaSnackbar/show'
    }),
    ...mapActions(['authUser', 'logoutUser'])
  },
  computed: mapGetters(['loggedIn', 'authToken'])
}
</script>
