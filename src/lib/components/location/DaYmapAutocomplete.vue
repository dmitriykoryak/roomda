<template>
  <div>
    <v-combobox
      class="da-ymap-combox"
      :value="value"
      @update:search-input="disabled ? null : fetchItems($event)"
      @change="$emit('input', $event ? $event.text : '')"
      :items="items"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :dense="dense"
      :outlined="outlined"
      :clearable="clearable"
      :loading="loading"
      append-icon="mdi-map"
      :error-messages="errorMessages"
      :menu-props="{
        absolute: true,
        left: true,
        bottom: true,
        'nudge-top': -18,
        attach: '.da-ymap-combox'
      }"
      @click:append="dialog = true"
      @click:clear="clear"
      :filter="
        () => {
          return true
        }
      "
    >
      <template v-slot:selection="{ item }">
        <div class="d-flex align-center flex-nowrap">
          <div class="caption">
            {{ value }}
          </div>
        </div>
      </template>

      <template v-slot:item="{ item }">
        <v-list-item-content>
          <div class="caption">{{ item.text }}</div>
        </v-list-item-content>
      </template>
    </v-combobox>

    <!--Модальное окно Карты-->
    <da-dialog v-model="dialog" fullscreen randImg title="Карта">
      <v-card tile class="ymap-wrapper">
        <da-yandex-map
          :zoom="11"
          :center="center"
          :markers="markers"
          height="100%"
          @map-was-initialized="initClickEvent"
        ></da-yandex-map>
      </v-card>
    </da-dialog>
    <!--Модальное окно Карты конец-->
  </div>
</template>

<script>
import DaYandexMap from '~~/components/location/DaYandexMap.vue'
import YandexMapMixin from '~~/components/location/YandexMapMixin.vue'
import { loadYmap } from 'vue-yandex-maps'
import axios from 'axios'

export default {
  mixins: [YandexMapMixin],
  components: {
    DaYandexMap
  },
  props: {
    value: String,
    label: String,
    placeholder: String,
    city: String,
    errorMessages: String,
    disabled: Boolean,
    dense: Boolean,
    outlined: Boolean,
    clearable: Boolean
  },
  data() {
    return {
      dialog: false,
      center: [45.0478, 38.96],
      markers: [],
      items: [],
      timer: null,
      loading: false
    }
  },
  methods: {
    async initClickEvent(e) {
      e.events.add('click', async e => {
        const coords = e.get('coords')
        const address = await this.getAddressByCoords(coords)
        this.$emit('input', address)
        this.markers = [
          {
            id: 1,
            coords,
            balloon: {
              body: `<div class="d-flex align-center"><span class="material-icons info--text mr-1">place</span>${address}</div>`
            }
          }
        ]
      })
    },
    fetchItems(address) {
      if (!address) return

      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(async () => {
        const fullAdress = `Россия, ${
          this.city ? `${this.city} ,` : ''
        }${address}`
        this.loading = true
        const response = await axios.get('https://geocode-maps.yandex.ru/1.x', {
          params: {
            geocode: fullAdress,
            ll: [this.center[1], this.center[0]].join(','),
            spn: '3.552069,2.400552',
            apikey: this.apikey,
            results: 3
          }
        })

        this.loading = false
        const parser = new DOMParser()
        const xml = parser.parseFromString(response.data, 'text/xml')
        const els = xml.getElementsByTagName('text')
        this.items = []
        this.$nextTick(() => {
          this.items = [...els].map((el, index) => {
            return {
              value: index,
              text: el.innerHTML
            }
          })
        })
      }, 500)
    },
    clear() {
      this.markers = []
      this.items = []
    }
  },
  watch: {
    // центрирование карты по выбранному городу
    city(cityName) {
      if (cityName) {
        this.clear()
        this.getCoordsByAddress(cityName).then(coords => (this.center = coords))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ymap-wrapper {
  height: calc(100vh - 56px);
}
</style>
