<template>
  <div class="da-google-map">
    <GmapMap
      :center="center"
      :zoom.sync="zoom"
      :map-type-id="mapTypeId"
      :options="options"
      ref="map"
      :style="styleObj"
    >
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
      </gmap-info-window>

      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :title="m.title"
        :clickable="true"
        :draggable="true"
        @click="toggleInfoWindow(m, index)"
      />
    </GmapMap>
  </div>
</template>

<script>
/**
 * Google map
 */
import Vue from 'vue'
import * as DaGoogleMapsSimple from 'da-google-maps-simple'
Vue.use(DaGoogleMapsSimple, {
  load: {
    key: 'AIzaSyBEGz0ZLH3bwonmxHzlITGcIDZTfmFRnE0',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then set installComponents to 'false'.
  //// If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})

export default {
  name: 'da-google-map',

  data: () => ({
    infoOptions: {
      content: '',
      //optional: offset infowindow so it visually sits nicely on top of our marker
      pixelOffset: {
        width: 0,
        height: -35
      }
    },
    infoWindowPos: null,
    infoWinOpen: false,
    currentMidx: null
  }),

  props: {
    center: {
      type: Object,
      default: function() {
        return {
          lat: 40.73061,
          lng: -73.935242
        }
      }
    },
    zoom: {
      type: Number,
      default: 7
    },
    options: Object,
    mapTypeId: {
      type: String,
      default: 'terrain'
    },
    styleObj: {
      type: Object,
      default: function() {
        return {
          height: '500px'
        }
      }
    },
    markers: Array
  },

  methods: {
    toggleInfoWindow(marker, idx) {
      this.infoWindowPos = marker.position
      this.infoOptions.content =
        (marker.subtitle || '') +
        '<div class="title">' +
        (marker.title || '') +
        '</div>' +
        (marker.text || '')

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    }
  }
}
</script>

<style lang="scss">
.da-google-map {
  .gm-style-iw-d {
    padding: 4px;
    .title {
      font-size: 15px;
      font-weight: 700;
      color: #0f0f0f;
    }
  }
}
</style>
