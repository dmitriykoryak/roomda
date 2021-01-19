<template>
  <div>
    <FilterBtnMenu
      v-if="$vuetify.breakpoint.smAndDown"
      :loading="loading"
      :count="total[$route.meta.isSale ? 'sale' : 'rent']"
      :isSale="$route.meta.isSale"
      @fetch:realty="fetchRealty($event, true)"
    />

    <v-container class="realty-list-page">
      <breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" />

      <v-row class="realty-list-page">
        <v-col
          :col="12"
          :md="$vuetify.breakpoint.lgAndUp ? 10 : 12"
          class="py-0"
        >
          <heading1>
            {{ $route.meta.isSale ? "Продажа" : "Аренда" }} квартир в Краснодаре
          </heading1>

          <FilterForm
            v-if="$vuetify.breakpoint.mdAndUp"
            @update:loading="loading = $event"
            @fetch:realty="fetchRealty($event, true)"
            :loading="loading"
            :isSale="$route.meta.isSale"
            :count="total[$route.meta.isSale ? 'sale' : 'rent']"
          />

          <RealtyList
            :realtyList="realtyList"
            :isSale="$route.meta.isSale"
            :loading="loading"
            :page.sync="page"
            :totalPages="
              Math.floor(total[$route.meta.isSale ? 'sale' : 'rent'] / 10)
            "
            :count="total[$route.meta.isSale ? 'sale' : 'rent']"
            :hidePagination="noResMessage"
          />
        </v-col>

        <v-col :col="12" :md="2" class="py-0 d-none d-lg-block"> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import FilterForm from "@/components/filter/FilterForm";
export default {
  components: {
    FilterForm,
  },
  created() {
    document.title =
      (this.$route.meta.isSale ? "Продажа" : "Аренда") + " недвижимости";
    this.fetchRealty(null, true);
  },
  data() {
    return {
      page: 1,
      loading: false,
      dialog: false,
    };
  },
  methods: {
    async fetchRealty(params, reload) {
      this.loading = true;
      await this.$store.dispatch("fetchRealty", {
        params: { ...this.searchItem, ...params },
        reload: reload,
        isSale: this.$route.meta.isSale,
        fetchAgain: true,
      });
      this.loading = false;
    },
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/",
        },
        {
          text: this.$route.meta.isSale ? "Продажа" : "Аренда",
        },
      ];
    },
    realtyList() {
      return this.$route.meta.isSale ? this.sale : this.rent;
    },
    ...mapState([
      "sale",
      "rent",
      "cityId",
      "total",
      "searchItem",
      "realtySubType",
      "noResMessage",
    ]),
    ...mapGetters(["isMobileApp"]),
  },
  watch: {
    page(val) {
      this.fetchRealty({ page: val }, true);
    },
    cityId(val) {
      this.fetchRealty({ page: 1 }, true);
    },
    "$route.meta.isSale"() {
      document.title =
        (this.$route.meta.isSale ? "Продажа" : "Аренда") + " недвижимости";
      this.fetchRealty();
    },
  },
};
</script>

<style lang="scss" scoped></style>
