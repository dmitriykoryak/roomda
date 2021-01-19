<template>
  <v-footer class="blue-grey darken-4 footer d-none d-md-flex">
    <v-container>
      <v-row>
        <v-col :col="12" :md="4">
          <h4 class="white--text">В {{ city.name_case || city.label }}</h4>
          <ul>
            <li>
              <a @click.prevent="goTo('36')">Студии</a>
            </li>
            <li>
              <a @click.prevent="goTo('1')">Однокомнатные</a>
            </li>
            <li>
              <a @click.prevent="goTo('2')">Двухкомнатные</a>
            </li>
            <li>
              <a @click.prevent="goTo('3')">Трехкомнатные</a>
            </li>
            <li>
              <a @click.prevent="goTo('4')">Четырехкомнатные и более</a>
            </li>
          </ul>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="white--text">Города</h4>
          <v-row dense>
            <template
              v-for="(item, id, index) in getList(mapKey, 'city_id') &&
                getList(mapKey, 'city_id').items"
            >
              <v-col v-if="index < 12" :key="id" cols="6">
                <a @click.prevent="$store.commit('updateCityId', id)">{{
                  item.label
                }}</a>
              </v-col>
            </template>
          </v-row>
        </v-col>
        <v-col :col="12" :md="4">
          <router-link :to="{ name: 'policy' }">
            <h4 class="white--text">Политика конфиденциальности</h4>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      mapKey: "sale/default",
    };
  },
  methods: {
    goTo(typeId) {
      this.$store.dispatch("filtrateRealty", {
        isSale: true,
        typeId: typeId,
        typeGroupId: "1",
      });
    },
  },
  computed: {
    city() {
      return this.getListItem(this.mapKey, "city_id", this.cityId);
    },
    ...mapState(["cityId", "searchItem"]),
    ...mapGetters(["getList", "getListItem"]),
  },
};
</script>

<style lang="scss" scoped>
.v-application .footer {
  a {
    font-size: 14px;
    color: #ccc;
    &:hover {
      color: #fff;
    }
  }

  ul {
    padding-left: 0;
    margin-top: 10px;
    list-style-type: none;
    li {
      margin-bottom: 7px;
    }
  }
}
</style>
