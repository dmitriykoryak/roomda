<template>
  <v-container
    class="main-form"
    :class="{ 'pa-0': $vuetify.breakpoint.smAndDown }"
  >
    <v-img
      :src="$conv('assets/img/main-fon.jpg', true)"
      gradient="to top right, rgba(50,50,50,.33), rgba(50,50,50,.33)"
      aspect-ratio="2.67"
      class="m-form-img"
      min-height="352"
    >
      <div
        class="d-flex align-center justify-center m-form-in"
        :class="$vuetify.breakpoint.smAndDown ? '' : 'h-100'"
      >
        <div>
          <h1
            :class="$vuetify.breakpoint.smAndDown ? 'd-none' : ''"
            class="white--text"
          >
            Недвижимость в Краснодаре
          </h1>

          <div>
            <div :class="$vuetify.breakpoint.smAndDown ? 'mt-6' : ''">
              <v-btn
                @click="
                  $emit('update:isSale', true);
                  $nextTick(() => fetchTotal(true));
                "
                :class="{ 'black white--text': isSale }"
                rounded
                >Купить</v-btn
              >
              <v-btn
                @click="
                  $emit('update:isSale', false);
                  $nextTick(() => fetchTotal(true));
                "
                :class="{ 'black white--text': !isSale }"
                class="ml-2"
                rounded
                >Снять</v-btn
              >
            </div>

            <v-sheet
              class="m-form-sheet d-flex align-center pa-2 my-3"
              :color="
                $vuetify.theme.dark
                  ? 'black'
                  : $vuetify.breakpoint.smAndDown
                  ? 'blue-grey lighten-5'
                  : ''
              "
            >
              <v-row
                :no-gutters="$vuetify.breakpoint.mdAndUp"
                :dense="$vuetify.breakpoint.mdAndDown"
              >
                <v-col cols="6" md="3" class="align-center d-flex d-md-none">
                  <v-select
                    :value="isSale"
                    @change="
                      $emit('update:isSale', $event);
                      $nextTick(() => fetchTotal(true));
                    "
                    :items="[
                      { text: 'Купить', value: true },
                      { text: 'Снять', value: false },
                    ]"
                    solo
                    flat
                    dense
                    hide-details
                  ></v-select>
                  <v-divider
                    vertical
                    class="mx-1 d-none d-md-block"
                  ></v-divider>
                </v-col>

                <v-col cols="6" md="3" class="d-flex align-center">
                  <da-select-simple
                    :value="realtyTypeId"
                    @input="changeRealtyTypeM"
                    :items="realtyTypeItems"
                    solo
                    flat
                    dense
                    hide-details
                  ></da-select-simple>
                  <v-divider
                    vertical
                    class="mx-1 d-none d-md-block"
                  ></v-divider>
                </v-col>

                <v-col cols="12" md="3" class="d-flex align-center">
                  <div
                    v-if="realtyTypeId === '1'"
                    :style="{
                      backgroundColor: $vuetify.theme.dark
                        ? '#212121'
                        : 'white',
                      borderRadius: '4px',
                    }"
                  >
                    <v-btn-toggle
                      :value="searchItem.type_id"
                      @change="
                        updateSearchItem('type_id', $event);
                        fetchTotal(true);
                      "
                      :color="
                        $vuetify.theme.dark
                          ? 'white'
                          : $vuetify.breakpoint.mdAndDown
                          ? 'primary'
                          : 'black'
                      "
                      dense
                      group
                      multiple
                    >
                      <v-btn
                        v-for="(room, i) in rooms"
                        :key="i"
                        :value="room.id"
                        class="caption"
                        text
                        >{{ room.label }}</v-btn
                      >
                    </v-btn-toggle>
                  </div>

                  <da-select-simple
                    v-else
                    :value="searchItem.type_id"
                    @input="
                      updateSearchItem('type_id', $event);
                      fetchTotal(true);
                    "
                    :items="realtySubTypeItems"
                    placeholder="Тип"
                    solo
                    flat
                    dense
                    hide-details
                    clearable
                  ></da-select-simple>
                </v-col>

                <v-col cols="12" md="3" class="d-flex align-center">
                  <v-divider
                    vertical
                    class="mx-1 d-none d-md-block"
                  ></v-divider>
                  <v-text-field
                    :value="searchItem.costFrom"
                    @input="updateSearchItem('costFrom', $event)"
                    v-mask="'##########'"
                    solo
                    flat
                    dense
                    hide-details
                    placeholder="Цена от"
                    @blur="fetchTotal(true)"
                  ></v-text-field>
                  <span class="mx-1">-</span>
                  <v-text-field
                    :value="searchItem.costTo"
                    @input="updateSearchItem('costTo', $event)"
                    v-mask="'##########'"
                    solo
                    flat
                    dense
                    hide-details
                    placeholder="до"
                    class="flex-grow-1"
                    @blur="fetchTotal(true)"
                  ></v-text-field>
                  <span class="mx-2">₽</span>
                  <v-divider
                    vertical
                    class="mx-1 d-none d-md-block"
                  ></v-divider>
                </v-col>

                <v-col cols="12" md="3">
                  <da-select
                    :value="searchItem.district_id"
                    @input="
                      updateSearchItem('district_id', $event);
                      fetchTotal(true);
                    "
                    attr="district_id"
                    solo
                    flat
                    dense
                    hide-details
                    clearable
                    placeholder="Район"
                    mapKey="sale/default"
                    :apiUrl="$config.api.url.realty"
                    :editedItem="{ city_id: cityId }"
                    multiple
                  ></da-select>
                </v-col>
              </v-row>
            </v-sheet>

            <div class="d-flex align-center">
              <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
              <v-btn
                :to="{ name: isSale ? 'mapSale' : 'mapRent' }"
                :large="$vuetify.breakpoint.mdAndUp"
                class="white"
                :class="{
                  'flex-grow-1': $vuetify.breakpoint.mdAndDown,
                  'grey darken-3': $vuetify.theme.dark,
                  white: !$vuetify.theme.dark,
                }"
                ><v-icon :left="$vuetify.breakpoint.mdAndUp" color="red"
                  >place</v-icon
                ><span class="d-none d-sm-block caption">Смотреть на карте</span
                ><span class="d-flex d-sm-none caption">На карте</span>
              </v-btn>
              <v-btn
                :loading="loading"
                :large="$vuetify.breakpoint.mdAndUp"
                class="yellow ml-3 caption text-truncate"
                :class="{
                  'flex-grow-1': $vuetify.breakpoint.mdAndDown,
                  'black--text': $vuetify.theme.dark,
                  yellow: !$vuetify.theme.dark,
                }"
                @click="
                  $router.push({
                    name: isSale ? 'realtysaleList' : 'realtyList',
                  })
                "
              >
                <span v-if="total[isSale ? 'sale' : 'rent']">
                  Показать<span class="mx-1 font-weight-bold">{{
                    total[isSale ? "sale" : "rent"]
                  }}</span
                  >объявления
                </span>
                <span v-else>
                  Объявлений не найдено
                </span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-img>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import FilterMixin from "@/components/filter/FilterMixin.vue";

export default {
  mixins: [FilterMixin],
  created() {
    this.init();
  },
  props: {
    isSale: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      rooms: [
        {
          label: "Студия",
          id: "36",
        },
        {
          label: 1,
          id: "1",
        },
        {
          label: 2,
          id: "2",
        },
        {
          label: 3,
          id: "3",
        },
        {
          label: "4+",
          id: "4",
        },
      ],
      loading: false,
    };
  },
  methods: {
    async init() {
      this.loading = true;
      await this.filterMixinInit();
      //   await this.fetchTotal();
      this.loading = false;
    },
    async changeRealtyTypeM(realtyTypeId) {
      this.loading = true;
      await this.changeRealtyType(realtyTypeId);
      await this.fetchTotal(true);
      this.loading = false;
    },
    async fetchTotal(reload = false) {
      this.loading = true;
      await this.$store.dispatch("fetchRealtyTotal", {
        isSale: this.isSale,
        params: this.searchItem,
        reload: reload,
      });
      this.loading = false;
    },
  },
  computed: {
    ...mapState(["cityId", "total"]),
  },
};
</script>

<style lang="scss" scoped>
.m-form-img {
  position: relative;
  .m-form-in {
    & > div {
      width: 85%;
    }
  }
}

.m-form-sheet {
  min-height: 60px;
}

@media (max-width: 1263px) {
  .m-form-img {
    .m-form-in {
      & > div {
        width: 98%;
      }
    }
  }
}

@media (max-width: 960px) {
  .m-form-img {
    .m-form-in {
      & > div {
        width: 95%;
      }
    }
  }
}
</style>
