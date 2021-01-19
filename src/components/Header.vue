<template>
  <v-container class="header">
    <v-row no-gutters>
      <v-col cols="4" class="d-flex align-center">
        <template v-if="isMobileApp">
          <v-btn v-if="$route.name === 'main'" icon class="mr-3"
            ><v-icon>home</v-icon></v-btn
          >
          <v-btn v-else icon @click="$router.go(-1)" class="mr-3"
            ><v-icon>keyboard_arrow_left</v-icon></v-btn
          >
        </template>

        <!-- <v-divider vertical class="mr-4"></v-divider> -->
        <router-link to="/" class="logo">
          <v-img
            :src="
              $conv(
                'assets/img/logo-' +
                  ($vuetify.theme.dark ? 'dark' : 'white') +
                  '.png',
                true
              )
            "
            :width="120"
          ></v-img>
        </router-link>
        <a
          href="#"
          class="ml-2"
          :class="$vuetify.breakpoint.smAndDown ? 'd-none' : ''"
          @click.prevent="$emit('click:city')"
        >
          <v-icon v-if="$vuetify.breakpoint.mdAndUp" class="info--text loc"
            >location_on</v-icon
          >
          {{ city }}
        </a>
      </v-col>
      <v-col cols="8">
        <div class="d-flex align-center justify-end">
          <DaDarkThemeButton />
          <v-btn
            v-if="!isMobileApp"
            icon
            class="lighten-3 ml-3"
            :to="{ name: 'favorites' }"
          >
            <v-icon
              class="icon-favorite"
              :class="
                (favItems.sale && favItems.sale.length) ||
                (favItems.rent && favItems.rent.length)
                  ? 'red--text'
                  : ''
              "
            >
              favorite
            </v-icon>
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                v-on="on"
                class="caption"
                :class="$vuetify.breakpoint.smAndDown ? 'd-none' : ''"
              >
                Мои обьявления
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :to="item.to"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            class="ml-3 caption"
            text
            :class="
              ($vuetify.breakpoint.smAndDown ? 'd-none' : '') +
                ($vuetify.theme.dark ? ' green darken-4' : ' success')
            "
            :to="{ name: 'newAd' }"
          >
            Добавить объявление
          </v-btn>

          <v-menu v-if="loggedIn" offset-y left eager>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" class="ml-3">
                <v-icon large>account_circle</v-icon>
              </v-btn>
            </template>

            <v-card class="mx-auto" width="250" outlined tile>
              <v-list>
                <v-list-item @click="">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      user.personAuthName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      user.roleLabel
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item :to="{ name: 'pay' }">
                  <v-list-item-icon>
                    <v-icon>mdi-account-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Подписка</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="$store.dispatch('logout')">
                  <v-list-item-icon>
                    <v-icon>exit_to_app</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Выход</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-btn
            v-else
            text
            class="ml-3 caption"
            :class="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'"
            :to="{ name: 'login' }"
          >
            Вход
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DaDarkThemeButton from "~~/components/elems/DaDarkThemeButton.vue";

export default {
  components: {
    DaDarkThemeButton,
  },
  data() {
    return {
      items: [{ title: "Избранное", to: { name: "favorites" } }],
      mapKey: "rent/default",
    };
  },
  props: {
    city: String,
  },
  computed: {
    ...mapState(["cityId"]),
    ...mapState({
      favItems: (state) => state.Favorites.items,
      user: (state) => state.UserState.user,
    }),
    ...mapGetters(["loggedIn", "isMobileApp"]),
  },
};
</script>

<style lang="scss">
.header {
  .loc {
    max-width: 24px;
  }
  .logo {
    margin-left: -18px;
    margin-top: -13px;
    margin-bottom: -10px;
  }
}

.header-city-select .v-text-field {
  margin-top: 0;
}
</style>
