<template>
  <div class="realty-view-page">
    <v-container>
      <breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" />

      <div
        class="font-weight-bold"
        :class="$vuetify.breakpoint.smAndUp ? 'display-1' : 'title'"
      >
        {{ title }}
      </div>
      <div
        :class="$vuetify.breakpoint.smAndUp ? 'subtitle-1' : 'subtitle-2'"
        :style="{ maxWidth: '600px' }"
      >
        {{ address }}
      </div>

      <v-divider class="mt-4 mb-3"></v-divider>

      <v-row no-gutters>
        <v-col cols="7" class="grey--text caption d-flex align-center">
          <div>№ {{ realty.id }} от {{ realty.dt | formatDT }}</div>
        </v-col>

        <v-col cols="5">
          <div
            :width="$vuetify.breakpoint.smAndUp ? 260 : '100%'"
            class="d-flex justify-end float-right"
          >
            <da-share-button
              :title="title"
              :url="$config.siteHost + '/' + $route.fullPath"
              color="info"
            ></da-share-button>

            <fav-button
              :isSale="isSale"
              :realtyId="realty.id || -1"
              mini
            ></fav-button>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-container :class="{ 'px-0': $vuetify.breakpoint.smAndDown }">
      <v-card
        class="prev-card"
        :outlined="$vuetify.breakpoint.smAndDown"
        :tile="$vuetify.breakpoint.smAndDown"
      >
        <v-row no-gutters>
          <v-col cols="12" md="8">
            <v-carousel
              v-model="carousel"
              class="realty-carousel"
              :progress="$vuetify.breakpoint.smAndDown"
              :hide-delimiters="$vuetify.breakpoint.smAndDown"
              delimiter-icon="mdi-minus"
              hide-delimiter-background
              :height="$vuetify.breakpoint.smAndDown ? 260 : 500"
            >
              <v-carousel-item
                v-for="(img, i) in realty.images"
                :key="i"
                :src="img.url"
                @click="dialog = true"
              ></v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col cols="12" md="4">
            <v-container :class="$vuetify.breakpoint.mdAndUp ? 'pa-6' : 'pa-3'">
              <div class="display-1 font-weight-bold">
                {{ realty.cost | currency }}
              </div>
              <!-- <div>
                <a href="">Следить за ценой</a>
              </div> -->
              <v-divider class="my-3"></v-divider>
              <div class="font-weight-bold">95 238 ₽ за м²</div>
              <div class="my-3">Ипотека, первичная продажа вторички</div>
              <da-phone-button
                v-model="phone"
                :apiUrl="$config.api.url.realty + '/personrealty/client/phone'"
                :params="{ id: realty.id }"
                :beforeBindAttrs="{
                  class: $vuetify.theme.dark ? ' lime darken-4' : 'yellow',
                  text: true,
                  block: true
                }"
                :afterBindAttrs="{
                  text: true,
                  block: true,
                  class: $vuetify.theme.dark ? 'black--text' : ''
                }"
              />

              <v-list-item class="px-0 mt-1">
                <v-icon class="mr-3">mdi-account</v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ realty.name }}</v-list-item-title>
                  <v-list-item-subtitle>Частное лицо</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <da-dialog
      v-model="dialog"
      fullscreen
      randImg
      leftArrow
      transition="dialog-transition"
    >
      <v-card class="d-flex align-center justify-center h-100" color="black">
        <v-carousel
          v-model="carousel"
          class="realty-carousel-in"
          :progress="$vuetify.breakpoint.smAndDown"
          :hide-delimiters="$vuetify.breakpoint.smAndDown"
          delimiter-icon="mdi-minus"
          hide-delimiter-background
          :height="$vuetify.breakpoint.smAndDown ? 520 : 800"
        >
          <v-carousel-item
            v-for="(img, i) in realty.images"
            :key="i"
            :src="img.url"
          ></v-carousel-item>
        </v-carousel>
      </v-card> </da-dialog
    ><!-- Модальное окно просмотра изображения -->

    <v-container>
      <v-row>
        <v-col
          :col="12"
          :md="$vuetify.breakpoint.lgAndUp ? 8 : 12"
          class="py-0"
        >
          <v-row>
            <v-col cols="12" sm="6">
              <v-hover v-slot:default="{ hover }">
                <v-card
                  @click="
                    scrollToMap()
                    hidePanorama()
                  "
                  outlined
                  :elevation="hover ? 4 : 0"
                >
                  <v-img
                    src="https://static-maps.yandex.ru/1.x/?l=map&ll=39.02686%2C45.05785&z=13&size=600%2C240&lang=ru_RU"
                    height="120"
                  ></v-img>

                  <v-card-title>
                    Расположение
                  </v-card-title>

                  <v-card-subtitle>
                    Объекты рядом
                  </v-card-subtitle>
                </v-card>
              </v-hover>
            </v-col>

            <v-col cols="12" sm="6">
              <v-hover v-slot:default="{ hover }">
                <v-card
                  @click="
                    scrollToMap()
                    showPanorama()
                  "
                  outlined
                  :elevation="hover ? 4 : 0"
                >
                  <v-img
                    src="https://static-pano.maps.yandex.ru/v1/?panoid=1306538642_773635949_23_1565426021&size=500%2C295&api_key=realty&signature=vtUUZHHW1wvLAxICjwyOg7j7HtX73k%2FSyYBPQ%2F%2B%2B9zo%3D"
                    height="120"
                  ></v-img>

                  <v-card-title>
                    Панорама
                  </v-card-title>

                  <v-card-subtitle>
                    Обзор вокруг
                  </v-card-subtitle>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <div class="headline font-weight-bold mt-4">Описание</div>

          <v-divider class="my-3"></v-divider>

          <v-row
            :dense="$vuetify.breakpoint.smAndUp"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col v-if="realty.area" cols="12" sm="4">
              <span class="font-weight-bold">{{ realty.area }} м²</span
              ><span class="grey--text"> — общая площадь</span>
            </v-col>

            <v-col v-if="realty.area_living" cols="12" sm="4">
              <span class="font-weight-bold">{{ realty.area_living }} м²</span
              ><span class="grey--text"> — жилая</span>
            </v-col>

            <v-col v-if="realty.area_kitchen" cols="12" sm="4">
              <span class="font-weight-bold">{{ realty.area_kitchen }} м²</span
              ><span class="grey--text"> — кухня</span>
            </v-col>

            <v-col v-if="realty.rooms" cols="12" sm="4">
              <span class="font-weight-bold">{{ realty.rooms }} комната</span>
            </v-col>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <v-row
            :dense="$vuetify.breakpoint.smAndUp"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col v-if="realty.repair" cols="12" sm="4">
              <span class="grey--text">Ремонт: </span>
              <span class="font-weight-bold">{{
                getListLabel(mapKey, 'repair', realty.repair)
              }}</span>
            </v-col>

            <v-col v-if="realty.floor" cols="12" sm="4">
              <span class="font-weight-bold">{{ realty.floor }} этаж</span
              ><span class="grey--text"> из {{ realty.floors }}</span>
            </v-col>

            <v-col v-if="realty.furniture" cols="12" sm="4">
              <span class="grey--text">Мебель: </span>
              <span class="font-weight-bold">{{
                getListLabel(mapKey, 'furniture', realty.furniture)
              }}</span>
            </v-col>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex align-center">
            <v-list-item class="px-0">
              <v-icon class="mr-3">mdi-account</v-icon>
              <v-list-item-content>
                <v-list-item-title>{{ realty.name }}</v-list-item-title>
                <v-list-item-subtitle>Частное лицо</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <da-phone-button
              v-model="phone"
              :apiUrl="$config.api.url.realty + '/personrealty/client/phone'"
              :params="{ id: realty.id }"
              :beforeBindAttrs="{
                class: $vuetify.theme.dark ? ' lime darken-4' : 'yellow',
                text: true
              }"
              :afterBindAttrs="{
                text: true,
                class: $vuetify.theme.dark ? 'black--text' : ''
              }"
            />
          </div>

          <v-divider class="my-3"></v-divider>

          <template v-if="realty.description">
            <div class="title font-weight-bold">Коментарий продавца</div>
            <div v-html="realty.description"></div>
            <v-divider class="my-3"></v-divider>
          </template>

          <div class="map-wrap">
            <DaYandexMap
              :height="600"
              :zoom="13"
              :center="coords"
              :markers="markers"
              class="mt-6 no-refresh"
              @map-was-initialized="ymaps = $event"
            ></DaYandexMap>
          </div>

          <!-- <div class="headline font-weight-bold mt-12">Похожие объявления</div>
          <RealtyList /> -->
        </v-col>

        <v-col :col="12" :md="4" class="py-0 d-none d-lg-block"> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import * as easings from 'vuetify/es5/services/goto/easing-patterns'
import DaShareButton from '~~/components/elems/DaShareButton'
import { mapGetters } from 'vuex'

export default {
  components: {
    DaShareButton
  },
  data() {
    return {
      phone: null,
      scrollOptions: {
        duration: 700,
        offset: 50,
        easing: easings.easeOutCubic
      },
      ymaps: null,
      pManager: null,
      dialog: false,
      carousel: 0
    }
  },
  props: {
    realty: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isSale: Boolean,
    markers: Array,
    mapKey: String
  },
  methods: {
    async showPanorama() {
      this.pManager = await this.ymaps.getPanoramaManager()
      this.pManager.openPlayer(this.coords)
    },
    async hidePanorama() {
      if (this.pManager) {
        this.pManager.closePlayer()
      }
    },
    scrollToMap() {
      this.$nextTick(() => this.$vuetify.goTo('.map-wrap', this.scrollOptions))
    }
  },
  computed: {
    coords() {
      return this.markers[0] && this.markers[0].coords
    },
    title() {
      if (!this.realty.id) {
        return ''
      }
      let out =
        this.getListLabel(this.mapKey, 'type_id', this.realty.type_id) + ' '
      if (this.realty.area) {
        out += (this.realty.area || '') + ' м², '
      }
      if (this.realty.floor) {
        out += (this.realty.floor || '') + '/' + (this.realty.floors || '')
      } else if (this.realty.floors) {
        out += 'этажей - ' + this.realty.floors
      }
      document.title = out
      return out
    },
    address() {
      const city = this.getListLabel(
        this.mapKey,
        'city_id',
        this.realty.city_id,
        null,
        {}
      )
      const district = this.getListLabel(
        this.mapKey,
        'district_id',
        this.realty.district_id,
        this.realty,
        {}
      )
      return (
        (city ? `${city}, ` : '') +
        (district ? `${district}, ` : '') +
        (this.realty.street ? `${this.realty.street}, ` : ' ') +
        (this.realty.home ? 'д.' + this.realty.home : '')
      )
    },
    breadcrumbs() {
      return [
        {
          text: 'Главная',
          to: '/'
        },
        {
          text: this.isSale ? 'Продажа' : 'Аренда',
          to: { name: this.isSale ? 'realtysaleList' : 'realtyList' },
          exact: true
        },
        {
          text: this.title
        }
      ]
    },
    ...mapGetters(['isMobileApp', 'getListLabel'])
  }
}
</script>

<style lang="scss">
.map-wrap {
  margin-bottom: 100px;
}

// ya-share2
.v-application {
  .ya-share2__list {
    padding-left: 0;
  }
  &.theme--dark .ya-share2__title {
    color: white;
  }
}

.realty-carousel,
.realty-carousel-in {
  .v-image__image--cover {
    background-size: contain;
  }
  .v-window__container {
    background-color: black;
  }
}

.realty-carousel-in {
  margin-top: -150px;
}

@media all and (max-width: 960px) {
  .map-wrap {
    height: 300px;
  }
}
</style>
