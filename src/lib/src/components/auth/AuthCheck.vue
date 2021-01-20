<template> </template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'auth-check',

  created() {
    this.checkAuth()
  },

  data: () => ({}),

  props: {
    // noLogout = true - не делать logout при неудачной попытке авторизации
    noLogout: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    async checkAuth() {
      if (!this._.isEmpty(this.user)) {
        this.$nextTick(() => {
          this.$store.commit('changeRenderMode', this.renderComs.MODE_SHOW)
        })
      }

      if (this.renderComs) {
        this.$store.commit('changeRenderMode', this.renderComs.MODE_HIDE)
      }

      if (
        !this.loggedIn &&
        !(await this.$store.dispatch('login')) &&
        !this.noLogout
      ) {
        this.$store.dispatch('logout')
      }

      if (this.renderComs) {
        this.$nextTick(() => {
          this.$store.commit('changeRenderMode', this.renderComs.MODE_SHOW)
        })
      }
    }
  },

  computed: {
    ...mapGetters([
      'query',
      'redirect',
      'nextYear',
      'storage',
      'authToken',
      'loggedIn',
      'redirect'
    ]),
    ...mapState({
      user: state => state.UserState.user,
      renderComs: state => state.Render.renderComs
    })
  }
}
</script>

<style scoped lang="scss"></style>
