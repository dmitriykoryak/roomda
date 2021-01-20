<template>
  <div class="max-w-100 da-loc-home">
    <template v-if="mini">
      {{ localValue }}
    </template>
    <template v-else>
      <v-text-field
        v-model="localValue"
        :error-messages="errorMessages"
        append-outer-icon="fa-map-marked-alt"
        @blur="$emit('blur')"
        @click:append-outer="dialog = true"
        :label="label"
      >
      </v-text-field>

      <!--Модальное окно Карты-->
      <da-dialog
        v-model="dialog"
        fullscreen
        randImg
        :key="address"
        title="Карта"
      >
        <v-card tile>
          <v-overlay :value="progress">
            <v-progress-circular
              :size="70"
              :width="7"
              color="white"
              indeterminate
            ></v-progress-circular>
          </v-overlay>

          <iframe class="map-iframe" ref="iframe" :src="mapUrl"></iframe>
        </v-card>
      </da-dialog>
      <!--Модальное окно Карты конец-->
    </template>
  </div>
</template>

<script>
/**
 * Компонент home c картой
 */
import { mapGetters } from 'vuex'

export default {
  name: 'da-location-home',

  inject: ['$validator'],

  data: () => ({
    dialog: false,
    progress: true
  }),

  props: {
    value: [String, Number],
    editedItem: Object,
    parentAttr: String,
    parentId: [Number, String],
    attr: String,
    errorMessages: String,
    mapKey: String,
    label: String,
    mini: Boolean
  },

  methods: {},

  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    address() {
      let out = ''
      // if (this.region) {
      // 	out += this.region;
      // } else {
      // 	return out;
      // }
      if (this.city) {
        out += this.city
      } else {
        return out
      }
      if (this.street) {
        out += ', ' + this.street
      } else {
        return out
      }
      if (this.localValue) {
        out += ' ' + this.localValue
      } else {
        return out
      }
      return out
    },
    mapUrl() {
      return (
        this.protocol +
        '//crm.web2.d2.dev.bshost.ru/local/yandex-map/?address=' +
        this.address
      )
    },
    /**
     * Найти зависимые attr
     * @param state
     * @return {*}
     */
    depAttrs(state) {
      return (
        (this.list &&
          this.list['get-depends'] && [
            ...Object.keys(this.list['get-depends'])
          ]) ||
        []
      )
    },
    regionAttr() {
      return
    },
    cityAttr() {
      return this.depAttrs[0]
    },
    streetAttr() {
      return this.depAttrs[1]
    },
    regionId() {
      return this.editedItem[this.regionAttr]
    },
    cityId() {
      return this.editedItem[this.cityAttr]
    },
    region() {
      const list = this.getList(this.mapKey, this.regionAttr)
      return this.regionId && list && list.items[this.regionId].label
    },
    city() {
      const list = this.getList(this.mapKey, this.cityAttr)
      return this.cityId && list && list.items[this.cityId].label
    },
    list() {
      return this.listsInSet(this.mapKey)[this.attr]
    },
    street() {
      return this.editedItem[this.streetAttr]
    },
    ...mapGetters(['query', 'listsInSet', 'getList', 'protocol'])
  },

  //Скрыть процесс загрузки progress = false когда фрейм будет загружен
  watch: {
    dialog(val) {
      if (val) {
        this.$nextTick(() => {
          const iframe = this.$refs.iframe
          if (iframe) {
            iframe.onload = () => {
              this.progress = false
            }
          }
        })
      } else {
        this.progress = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.map-iframe {
  width: 100%;
  height: calc(100vh - 62px);
}
</style>
