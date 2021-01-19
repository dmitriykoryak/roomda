<template>
  <v-sheet class="swipe-list d-flex flex-nowrap" tile>
    <slot>
      <v-card
        v-for="(item, i) in items"
        :key="i"
        dark
        height="100"
        width="100"
        minWidth="100"
        class="white--text font-weight-bold caption d-flex flex-column justify-end pa-1 mr-2"
        :disabled="item.disabled"
        @click="clickItem(item, i)"
        :style="{
          background: `linear-gradient(${item.colorTop}, ${item.colorBottom})`
        }"
      >
        <v-icon size="90" class="card-icon">{{ item.icon }}</v-icon>
        <div class="text-truncate">{{ item.textT }}</div>
        <div class="text-truncate">{{ item.textB }}</div>
      </v-card>
    </slot>
  </v-sheet>
</template>

<script>
/**
 * Свайп список-карусель, для мобильных устройств
 */
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    clickItem(item, index) {
      if (item.noAuthMsg && !this.loggedIn) {
        this.snackbarShow({
          text: item.noAuthMsg,
          icon: 'info',
          color: 'info',
          hideBtn: true
        })
        this.$router.push(this.$config.default.routes.login)
      } else if (item.to) {
        this.$router.push(item.to)
      } else {
        this.$emit('click:item', index)
      }
    },
    ...mapMutations({
      snackbarShow: 'DaSnackbar/show'
    })
  },
  computed: mapGetters(['loggedIn'])
}
</script>

<style lang="scss" scoped>
.swipe-list {
  max-width: 100vw;
  position: relative;
  overflow-x: auto;
  padding: 0 0 10px 0;

  .card-icon {
    position: absolute;
    top: -15px;
    right: -20px;
  }
}
</style>
