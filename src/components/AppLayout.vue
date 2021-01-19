<template>
    <div>
      <AuthCheck noLogout />
      <Header
        @click:city="dialog = true"
        :city="getListLabel(mapKey, 'city_id', cityId, null, {})"
      />
      <!--bottom-menu-->
      <v-bottom-navigation v-if="isMobileApp" app grow dark height="42">
        <v-btn
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.to"
          active-class="yellow black--text"
          height="100%"
          :exact="item.to.name === 'main' ? true : false"
        >
          <v-icon size="20">
            {{ item.icon }}
          </v-icon>
        </v-btn>
        <v-btn
          v-blur
          link
          @click="loggedIn ? logout() : $router.push({ name: 'login' })"
          active-class="yellow black--text"
          height="100%"
        >
          <v-icon size="20">
            {{ loggedIn ? "fas fa-sign-out-alt" : "fas fa-sign-in-alt" }}
          </v-icon>
        </v-btn>
      </v-bottom-navigation>
      <!--bottom-menu end-->
      <TopMenu
        v-else
        @click:city="dialog = true"
        :city="getListLabel(mapKey, 'city_id', cityId, null, {})"
      />

      <v-content class="content">
        <v-fade-transition hide-on-leave>
          <router-view
            v-if="renderComs.mode === renderComs.MODE_SHOW"
            :cityId="cityId"
            @click:city="dialog = true"
          ></router-view>
        </v-fade-transition>
      </v-content>

      <Footer />
    </DaSwipeReload>

    <da-dialog
      v-model="dialog"
      width="600"
      title="Выбор города"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-2'"
      :darkToolbar="false"
    >
      <v-card tile>
        <v-card-text class="pt-3">
          <DaSelect
            :value="cityId"
            @input="
              $store.commit('updateCityId', $event);
              fetchDistricts();
              $store.commit('clearSearchItem');
            "
            attr="city_id"
            mapKey="sale/default"
            class="header-city-select"
          >
          </DaSelect>
        </v-card-text>
      </v-card> </da-dialog
><!--Модальное окно выбора города-->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TopMenu from "@/components/TopMenu.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import SetListMixin from "~~/mixins/SetListMixin.vue";
import AuthCheck from "~~/components/auth/AuthCheck.vue";

export default {
  mixins: [SetListMixin],
  components: {
    TopMenu,
    Header,
    Footer,
    AuthCheck
  },
    created() {
    this.init();
  },
  data() {
    return {
      dialog: false,
      mapKey: "sale/default",
      // чтобы успели подгрузится списки для Yandexmap и тп.
      isRenderContent: false,
      navItems: [
        {
          icon: "fas fa-home",
          to: { name: "main" },
        },
        {
          icon: "fas fa-list",
          to: { name: "realtysaleList" },
        },
        {
          icon: "fas fa-heart",
          to: { name: "favorites" },
        },
      ],
    };
  },
  methods: {
    async init() {
      this.$store.commit("Favorites/init");
      await this.prepSetList(this.$config.api.url.realty, null, false);
      this.mapKey = "rent/default";
      this.isRenderContent = true;
      await this.prepSetList(this.$config.api.url.realty, null, false);
      this.mapKey = "sale/default";
      this.fetchDistricts();
      const labels = {
        login: "Телефон",
        pass: "Пароль",
      };
      this.validationLocalize(labels);

      this.$router.beforeEach(async (to, from, next) => {
        // если не модальное окно
        if (to.fullPath.endsWith("#") && from.fullPath.endsWith("#")) {
          this.$store.commit("updateNoResMessage", false);
        }
        next();
      });
    },

    fetchDistricts() {
      this.$store.dispatch("fetchList", {
        mapKey: this.mapKey,
        apiUrl: this.$config.api.url.realty,
        attr: "district_id",
        item: {
          city_id: this.cityId,
        },
      });
    },
    logout() {
      if (confirm(`Вы действительно хотите выйти`)) {
        this.$store.dispatch("logout");
        this.$router.push({ name: "login" });
      }
    },
  },
  computed: {
    ...mapState(["cityId"]),
    ...mapState({
      renderComs: (state) => state.Render.renderComs,
    }),
    ...mapGetters([
      "validationLocalize",
      "isMobileApp",
      "loggedIn",
      "getListLabel",
    ]),
  },
};
</script>

<style scoped lang="scss">
.content {
    min-height: 600px;
  }
</style>
