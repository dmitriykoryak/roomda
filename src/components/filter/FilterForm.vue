<template>
  <v-form class="filter-form" @submit="fetchRealty({}, false, true)">
    <v-card :flat="flat" :outlined="flat">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-select
              :value="isSale ? 'Купить' : 'Снять'"
              @input="changeRoute($event)"
              :items="['Купить', 'Снять']"
              outlined
              dense
              hide-details
            ></v-select>
            <da-select-simple
              class="ml-2 type-sel"
              :value="realtyTypeId"
              @input="changeRealtyTypeF"
              :items="realtyTypeItems"
              outlined
              dense
              hide-details
            ></da-select-simple>
          </v-col>

          <v-col cols="12" md="4" v-if="realtySubTypeItems.length > 1">
            <v-card v-if="realtyTypeId === '1'" outlined>
              <v-btn-toggle
                dense
                group
                multiple
                :value="searchItem.type_id"
                @change="
                  updateSearchItem('type_id', $event);
                  fetchRealty({}, false, true);
                "
                color="primary"
              >
                <v-btn value="36" text height="30">
                  Студия
                </v-btn>

                <v-btn value="1" text height="30">
                  1
                </v-btn>

                <v-btn value="2" text height="30">
                  2
                </v-btn>

                <v-btn value="3" text height="30">
                  3
                </v-btn>

                <v-btn value="4" text height="30">
                  4+
                </v-btn>
              </v-btn-toggle>
            </v-card>

            <da-select-simple
              v-else
              :value="searchItem.type_id"
              @input="
                updateSearchItem('type_id', $event);
                fetchRealty({}, false, true);
              "
              :items="realtySubTypeItems"
              placeholder="Тип"
              outlined
              dense
              clearable
              hide-details
            ></da-select-simple>
          </v-col>

          <v-col cols="12" :md="realtySubTypeItems.length > 1 ? 4 : 8">
            <da-select
              :value="searchItem.district_id"
              @input="
                updateSearchItem('district_id', $event);
                fetchRealty({}, false, true);
              "
              attr="district_id"
              outlined
              dense
              hide-details
              placeholder="Район"
              mapKey="sale/default"
              :apiUrl="$config.api.url.realty"
              :editedItem="{ city_id: cityId }"
              clearable
              multiple
            ></da-select>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <da-select
              :value="searchItem.repair"
              @input="
                updateSearchItem('repair', $event);
                fetchRealty({}, false, true);
              "
              attr="repair"
              outlined
              dense
              hide-details
              placeholder="Ремонт"
              mapKey="sale/default"
              :apiUrl="$config.api.url.realty"
              clearable
              full-width
              hide-details
              multiple
            ></da-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-card outlined class="d-flex align-center">
              <v-text-field
                :value="searchItem.areaFrom"
                @input="updateSearchItem('areaFrom', $event)"
                v-mask="'#####'"
                placeholder="Площадь от"
                solo
                flat
                dense
                hide-details
                @blur="fetchRealty({}, false, true)"
              ></v-text-field>
              <span>-</span>
              <v-text-field
                :value="searchItem.areaTo"
                @input="updateSearchItem('areaTo', $event)"
                v-mask="'#####'"
                placeholder="до"
                solo
                flat
                dense
                hide-details
                @blur="fetchRealty({}, false, true)"
              ></v-text-field>
              <span class="pr-2">м<sup>2</sup></span>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-card outlined class="d-flex align-center">
                <v-text-field
                  :value="searchItem.costFrom"
                  @input="updateSearchItem('costFrom', $event)"
                  placeholder="Цена от"
                  v-mask="'##########'"
                  solo
                  flat
                  dense
                  hide-details
                  @blur="fetchRealty({}, false, true)"
                ></v-text-field>
                <span>-</span>
                <v-text-field
                  :value="searchItem.costTo"
                  @input="updateSearchItem('costTo', $event)"
                  v-mask="'##########'"
                  placeholder="до"
                  solo
                  flat
                  dense
                  hide-details
                  @blur="fetchRealty({}, false, true)"
                ></v-text-field>
                <span class="pr-2">₽</span>
              </v-card>

              <v-card outlined class="ml-2">
                <v-btn-toggle
                  dense
                  group
                  :value="searchItem.costM"
                  @change="
                    updateSearchItem('costM', $event);
                    fetchRealty({}, false, true);
                  "
                  color="primary"
                >
                  <v-btn text height="30">
                    Все
                  </v-btn>

                  <v-btn text height="30"> м<sup>2</sup> </v-btn>
                </v-btn-toggle>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-content class="more-panel">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    :value="searchItem.id"
                    @change="
                      updateSearchItem('id', $event);
                      fetchRealty({}, false, true);
                    "
                    placeholder="ID обьекта"
                    outlined
                    dense
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card outlined class="d-flex align-center">
                    <v-text-field
                      :value="searchItem.floorFrom"
                      @input="updateSearchItem('floorFrom', $event)"
                      placeholder="Этаж от"
                      solo
                      flat
                      dense
                      hide-details
                      @blur="fetchRealty({}, false, true)"
                    ></v-text-field>
                    <span>-</span>
                    <v-text-field
                      :value="searchItem.floorTo"
                      @input="updateSearchItem('floorTo', $event)"
                      placeholder="до"
                      solo
                      flat
                      dense
                      hide-details
                      @blur="fetchRealty({}, false, true)"
                    ></v-text-field>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card outlined class="d-flex align-center">
                    <v-text-field
                      :value="searchItem.floorsFrom"
                      @input="updateSearchItem('floorsFrom', $event)"
                      placeholder="Этажность от"
                      solo
                      flat
                      dense
                      hide-details
                      @blur="fetchRealty({}, false, true)"
                    ></v-text-field>
                    <span>-</span>
                    <v-text-field
                      :value="searchItem.floorsTo"
                      @input="updateSearchItem('floorsTo', $event)"
                      placeholder="до"
                      solo
                      flat
                      dense
                      hide-details
                      @blur="fetchRealty({}, false, true)"
                    ></v-text-field>
                  </v-card>
                </v-col>
              </v-row>

              <v-row dense>
                <v-spacer></v-spacer>

                <v-col cols="12" md="4">
                  <da-select
                    :value="searchItem.material"
                    @input="
                      updateSearchItem('material', $event);
                      fetchRealty({}, false, true);
                    "
                    attr="material"
                    placeholder="Материал"
                    mapKey="sale/default"
                    :apiUrl="$config.api.url.realty"
                    outlined
                    dense
                    hide-details
                    clearable
                    full-width
                    multiple
                  ></da-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card outlined>
                    <v-btn-toggle
                      dense
                      group
                      :value="searchItem.furniture"
                      @change="
                        updateSearchItem('furniture', $event);
                        fetchRealty({}, false, true);
                      "
                      color="primary"
                      :style="{ width: '100%' }"
                    >
                      <v-btn :value="1" text height="30" width="47%">
                        С мебелью
                      </v-btn>

                      <v-btn :value="0" text height="30" width="47%"
                        >Без мебели</v-btn
                      >
                    </v-btn-toggle>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-row dense>
          <v-col cols="12" sm="6" class="d-flex align-center">
            <v-btn
              text
              color="info"
              small
              @click="panel = panel === 0 ? undefined : 0"
              >{{ panel === 0 ? "Меньше параметров" : "Больше параметров" }}
              <v-icon right>{{
                panel === 0 ? "keyboard_arrow_up" : "keyboard_arrow_down"
              }}</v-icon></v-btn
            >
            <v-btn
              v-show="fillSearchItemLength"
              text
              color="red"
              small
              @click="resetForm(), fetchRealty({}, true)"
              >Сбросить {{ fillSearchItemLength }}</v-btn
            >
          </v-col>

          <v-col cols="12" md="6">
            <div class="d-flex justify-end align-center">
              <v-btn
                v-if="!hideMapBtn"
                class="grey w-50"
                :class="$vuetify.theme.dark ? 'darken-3' : 'lighten-3'"
                text
                :to="{ name: isSale ? 'mapSale' : 'mapRent' }"
                ><v-icon left color="red">place</v-icon
                ><span class="d-none d-sm-block caption">Смотреть на карте</span
                ><span class="d-flex d-sm-none caption">На карте</span>
              </v-btn>
              <v-btn
                text
                class="ml-2 caption w-50"
                :class="$vuetify.theme.dark ? 'lime darken-4' : 'yellow'"
                :loading="loading"
                @click="$emit('click:show-btn')"
              >
                <span v-if="count === 0 || noResMessage">
                  Ничего не найдено
                </span>
                <span v-else>
                  <span class="d-none d-md-inline-block">
                    Показать
                  </span>
                  <span class="font-weight-bold mx-1">{{ count }}</span>
                  объектов
                </span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-slide-group show-arrows class="mt-3">
      <v-chip
        v-for="(item, i) in realtyCountType[isSale ? 'sale' : 'rent']"
        :key="i"
        class="ml-1 mb-1"
        @click="filtrate(item)"
      >
        {{ getListLabel(mapKey, "type_id", item.type_id) }}
        <span class="grey--text ml-2">{{ item.count }}</span>
      </v-chip>
    </v-slide-group>

    <v-row no-gutters class="mt-3 mb-2">
      <v-col cols="12" md="4">
        <v-select
          placeholder="Выберите сортировку"
          @change="
            sort = $event;
            fetchSort($event);
          "
          :items="[
            {
              value: '-dt_check',
              text: 'Сортировать по актуальности',
            },
            {
              value: '-dt',
              text: 'Новые предложения',
            },
            {
              value: 'cost',
              text: 'Цена по возрастанию',
            },
            {
              value: '-cost',
              text: 'Цена по по убыванию',
            },
          ]"
          outlined
          hide-details
          dense
          clearable
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import FilterMixin from "@/components/filter/FilterMixin.vue";

export default {
  mixins: [FilterMixin],
  created() {
    if (!this.noFetchOnInit) {
      this.$store.dispatch("fetchRealtyCountTypes");
      this.filterMixinInit();
    }
  },
  data() {
    return {
      panel: undefined,
      mapKey: "sale/default",
    };
  },
  props: {
    noFetchOnInit: Boolean,
    loading: Boolean,
    count: Number,
    isSale: Boolean,
    flat: Boolean,
    hideMapBtn: Boolean,
    saleRoute: {
      type: Object,
      default: function() {
        return {
          name: "realtysaleList",
        };
      },
    },
    rentRoute: {
      type: Object,
      default: function() {
        return {
          name: "realtyList",
        };
      },
    },
  },
  methods: {
    async filtrate({ typeGroupId, type_id }) {
      typeGroupId = typeGroupId.toString();
      type_id = type_id.toString();

      const isNeedFetchRealty = await this.$store.dispatch("filtrateRealty", {
        isSale: this.isSale,
        typeId: type_id,
        typeGroupId,
      });
      if (isNeedFetchRealty) {
        this.$emit("fetch:realty");
      }
    },
    changeRoute(event) {
      if (this.isSale && event === "Снять") {
        this.$router.push(this.rentRoute);
      } else if (!this.isSale && event === "Купить") {
        this.$router.push(this.saleRoute);
      }
    },
    async changeRealtyTypeF(realtyTypeId) {
      await this.changeRealtyType(realtyTypeId);
      await this.fetchRealty({}, true, true);
    },

    /**
     * Сортировка
     */
    fetchSort(attr) {
      this.fetchRealty({ sort: attr }, true, true);
    },
  },

  computed: {
    fillSearchItemLength() {
      let out = 0;
      for (let [attr, val] of Object.entries(this.searchItem)) {
        if (
          (attr === "costM" && val === 0) ||
          (Array.isArray(val) && val.length === 0) ||
          (!Array.isArray(val) && !val)
        )
          continue;

        out++;
      }
      return out;
    },
    ...mapState(["cityId", "realtyCountType", "noResMessage", "realtyTypeId"]),
    ...mapGetters(["isMobileApp", "getListLabel"]),
  },
};
</script>

<style lang="scss">
.filter-form {
  .theme--light.v-card.v-card--outlined {
    // border: thin solid rgba(0, 0, 0, 0.18);
    border: thin solid rgba(0, 0, 0, 0.35);
  }
  .theme--dark.v-card.v-card--outlined {
    // border: thin solid rgba(0, 0, 0, 0.18);
    border: thin solid rgba(202, 202, 202, 0.35);
  }

  .type-sel {
    max-width: 138px;
  }

  .filter-sheet {
    margin-left: -6px;
    margin-right: -6px;
  }

  .more-panel .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
