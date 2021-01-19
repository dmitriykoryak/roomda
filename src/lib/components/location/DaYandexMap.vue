<template>
  <div
    :style="{
      height: this.height.toString().endsWith('%')
        ? this.height
        : this.height + 'px',
      position: 'relative'
    }"
    class="da-yandex-map"
  >
    <yandex-map
      :coords="center"
      :zoom="zoom"
      style="width: 100%; height: 100%;"
      :controls="['default']"
      map-type="map"
      :settings="mapSettings"
      :cluster-options="clusterOptions"
      @map-was-initialized="
        $emit('map-was-initialized', $event)
        mapInit = true
      "
    >
      <template v-if="mapInit">
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id + marker.coords.join()"
          :marker-id="marker.id"
          :marker-type="markerType"
          :coords="marker.coords"
          circle-radius="80"
          :hint-content="marker.label"
          :marker-fill="
            markerType === 'Circle'
              ? { color: marker.colors.fill, opacity: 1 }
              : {}
          "
          :marker-stroke="
            markerType === 'Circle'
              ? { color: marker.colors.stroke, width: 2 }
              : {}
          "
          :cluster-name="marker['cluster-name']"
          :balloon="marker.balloon"
          :balloon-template="marker.balloonTemplate"
          :callbacks="marker.callbacks"
        >
        </ymap-marker>
      </template>
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps'

export default {
  name: 'da-yandex-map',

  components: { yandexMap, ymapMarker },

  data: () => ({
    mapSettings: {
      apiKey: '795e4b78-7026-4a49-8272-bf3d1c05deb6',
      lang: 'ru_RU',
      coordorder: 'latlong',
      version: '2.1'
    },
    mapInit: false
  }),

  methods: {},

  props: {
    center: {
      type: Array,
      default: function() {
        return [45.05, 38.97]
      }
    },
    clusterOptions: {
      type: Object,
      default: function() {
        return {
          '1': {
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true
          }
        }
      }
    },
    zoom: {
      type: [String, Number],
      default: 15
    },
    markers: Array,
    markerType: {
      type: String,
      default: 'Placemark'
    },
    height: {
      type: [String, Number],
      default: '100%'
    }
  }
}
</script>

<style scoped lang="scss">
.da-yandex-map {
  .ymap-container {
    height: 100%;
  }
}
</style>
