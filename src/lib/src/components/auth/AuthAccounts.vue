<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-list>
        <v-list-item v-on="on">
          <v-list-item-content>
            <v-list-item-title class="title">{{ service }}</v-list-item-title>
            <v-list-item-subtitle>{{ site.name }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(account, index) in accounts"
        :key="index"
        @click="redirect(account.url + '?t=' + authToken())"
      >
        <v-icon left class="info--text">mdi-file-document-box</v-icon>
        <v-list-item-title>{{ account.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'auth-accounts',

  created() {
    this.getAccounts()
  },

  data: () => ({
    accounts: []
  }),

  methods: {
    async getAccounts() {
      const response = await this.query.get(
        this.$config.api.url.auth + '/app/account/to-me-list/',
        null,
        true,
        true
      )
      this.accounts = response.data.data || []
    }
  },
  computed: {
    service() {
      return this.firstUpperCase(this.$config.service) || 'Сервис без названия'
    },
    ...mapState({
      site: state => state.SiteState.site
    }),
    ...mapGetters(['query', 'redirect', 'authToken', 'firstUpperCase'])
  }
}
</script>

<style scoped lang="scss"></style>
