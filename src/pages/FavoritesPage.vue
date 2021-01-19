<template>
  <div class="fill-height">
    <v-container v-if="realtyListSale.length || realtyListRent.length">
      <RealtyList :realtyList="realtyListSale" :isSale="true" hideNoResults />
      <RealtyList :realtyList="realtyListRent" hideNoResults />
    </v-container>
    <v-container v-else class="fill-height align-center justify-center">
      <div class="fav-content">
        <div>
          <div
            class="mb-5 font-weight-bold fav-title"
            :class="$vuetify.breakpoint.xs ? 'title' : 'display-1'"
          >
            Добавляйте объявления в «Избранное»
          </div>
          <template v-if="loggedIn">
            <div class="mb-5">
              Не пропустите изменения цены в интересных вам предложениях.
            </div>
            <v-btn
              class="yellow"
              :class="{ 'black--text': $vuetify.theme.dark }"
              depressed
              min-width="246"
              :to="{ name: 'realtysaleList' }"
              >Начать новый поиск</v-btn
            >
          </template>
          <template v-else>
            <div class="mb-5">
              Не пропустите изменения цены в интересных вам предложениях.
              Авторизуйтесь для синхронизации избранного на всех устройствах.
            </div>
            <v-btn
              class="yellow"
              :class="{ 'black--text': $vuetify.theme.dark }"
              depressed
              min-width="246"
              :to="{ name: 'login' }"
              >Войти</v-btn
            >
          </template>
        </div>
        <div class="d-none d-md-flex">
          <v-img :src="$conv('assets/img/login.svg', true)" width="380"></v-img>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  created() {
    document.title = "Избранное";
    this.fetchFavorites();
  },
  data() {
    return {
      favorites: [],
    };
  },
  methods: {
    fetchFavorites() {
      this.favSaleIds.forEach(async (id) => {
        this.$store.dispatch("fetchRealty", { id, isSale: true });
      });
      this.favRentIds.forEach(async (id) => {
        this.$store.dispatch("fetchRealty", { id, isSale: false });
      });
    },
  },
  computed: {
    realtyListRent() {
      let out = [];
      this.favRentIds.forEach((favId) => {
        const realty = this.rent.find(
          (realty) => realty.id === parseInt(favId)
        );
        if (realty) {
          out.push(realty);
        }
      });
      return out;
    },
    realtyListSale() {
      let out = [];
      this.favSaleIds.forEach((favId) => {
        const realty = this.sale.find(
          (realty) => realty.id === parseInt(favId)
        );
        if (realty) {
          out.push(realty);
        }
      });
      return out;
    },
    favSaleIds() {
      return this.favItems.sale || [];
    },
    favRentIds() {
      return this.favItems.rent || [];
    },
    ...mapState({
      favItems: (state) => state.Favorites.items,
    }),
    ...mapState(["sale", "rent"]),
    ...mapGetters(["loggedIn"]),
  },
};
</script>

<style lang="scss" scoped>
.fav-content {
  max-width: 820px;
  display: grid;
  margin: 0 auto;
  display: flex;
  align-items: center;

  .fav-title {
    line-height: 1.2;
  }
}
</style>
