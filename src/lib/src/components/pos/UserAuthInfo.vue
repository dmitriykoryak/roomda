<template>
  <div class="user-auth-info">
    <v-menu offset-y left eager>
      <template v-slot:activator="{ on }">
        <v-card
          v-on="on"
          max-width="344"
          class="mx-auto visible-card"
          flat
          tile
        >
          <v-list-item>
            <v-list-item-avatar color="accent" class="avatar">
              <span class="white--text">{{ user.firstLetters }}</span>
            </v-list-item-avatar>
            <v-list-item-content class="py-0 d-none d-md-block">
              <v-list-item-title class="headline">{{
                user && user.personAuthName
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                user && user.roleLabel
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </template>

      <v-card class="mx-auto" max-width="344" outlined tile>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">{{ user && user.roleLabel }}</div>
            <v-list-item-title class="subtitle-1 mb-1">{{
              user && user.personAuthName
            }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar color="accent">
            <span class="white--text">{{ user.firstLetters }}</span>
          </v-list-item-avatar>
        </v-list-item>

        <v-divider></v-divider>

        <da-balance></da-balance>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text tile color="red" @click="$store.dispatch('logout')">
            <v-icon>exit_to_app</v-icon>
            Выход
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'user-auth-info',
  data: () => ({}),
  methods: {},
  computed: {
    ...mapState({
      user: state => state.UserState.user || {}
    }),
    ...mapGetters(['query', 'redirect'])
  }
}
</script>

<style lang="scss">
.user-auth-info {
  margin-right: -16px;

  .visible-card {
    background-color: rgba(0, 0, 0, 0) !important;
  }

  .v-list-item {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .v-list-item__title {
    font-size: 18px !important;
  }
}

@media all and (max-width: 960px) {
  .user-auth-info {
    .v-list-item__avatar:first-child.avatar {
      margin-right: 0;
    }

    .v-list-item {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
