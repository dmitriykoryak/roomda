<template>
  <v-app>
    <old-app-version v-if="oldAppVersion"></old-app-version>
    <template v-else>
      <DaSwipeRefresh :except="['.no-refresh']">
        <slot></slot>
      </DaSwipeRefresh>
    </template>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import DaSwipeRefresh from '~~/components/elems/DaSwipeRefresh.vue'
import OldAppVersion from '~~/components/layouts/OldAppVersion.vue'

export default {
  components: { DaSwipeRefresh, OldAppVersion },
  created() {
    this.$store.dispatch('mobileAppInit', { checkVersion: this.checkVersion })
  },
  props: {
    checkVersion: {
      type: Boolean,
      default: false
    }
  },
  computed: mapState({
    oldAppVersion: state => state.Cordova.oldAppVersion
  })
}
</script>
