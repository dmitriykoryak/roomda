<template>
  <v-navigation-drawer
    :value="value"
    @input="updateValue($event)"
    class="da-sidebar"
    :style="styleObj"
    right
    fixed
    stateless
  >
    <da-toolbar
      color="white"
      icon="mdi-arrange-send-backward"
      height="40"
      @dialog:close="updateValue(false)"
    ></da-toolbar>

    <v-tabs
      v-model="tab"
      show-arrows
      fixed-tabs
      color="blue lighten-2"
      background-color="blue-grey lighten-5"
      class="sidebar-tabs"
    >
      <v-tab
        v-for="(item, anchor) in items"
        :key="anchor"
        @click="clickTab(anchor)"
      >
        {{ item.label || map[item.link].label }}
      </v-tab>

      <v-tab-item v-for="(item, anchor) in items" :key="anchor">
        <component
          v-if="item.com"
          :is="item.com"
          :apiUrl="$config.api.url.react"
        ></component>
        <grid-wrapper
          v-else
          :level="level + 1"
          :apiUrl="apiUrl"
          :pathInit="'/' + alias + '/' + item.link"
          :servicePath="item.link"
          :scenarioInit="map[item.link].scenario"
        ></grid-wrapper>
      </v-tab-item>
    </v-tabs>
  </v-navigation-drawer>
</template>

<script>
import ScrollTopMixin from '~~/mixins/ScrollTopMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'da-sidebar',
  mixins: [ScrollTopMixin],

  created() {
    this.checkAnchor()
  },

  data() {
    return {
      tab: 0
    }
  },

  props: {
    value: Boolean,
    items: {
      type: Object,
      default: () => {}
    },
    level: Number,
    alias: String,
    apiUrl: String,
    map: Object,
    mobBreakpoint: Boolean,
    widthPercent: {
      type: Number,
      default: 60
    }
  },

  methods: {
    updateValue(val) {
      this.$emit('input', val)
    },

    clickTab(anchor) {
      this.$router.push(this.$route.path + anchor)
    },

    /**
     * Проверить url на наличие якоря вкладки
     * Если есть - открыть вкладку и перейти на нее
     */
    checkAnchor() {
      if (!this.items) return

      Object.keys(this.items).forEach((anchor, index) => {
        if (this.$route.fullPath.endsWith(anchor)) {
          this.updateValue(true)
          this.tab = index
        }
      })
    },

    /**
     * Добавить/убрать якорь из url при открытии/закрытии sidebar
     */
    onToggleSidebar(isOpen) {
      if (isOpen && !this.urlHasAnchor()) {
        const anchor = Object.keys(this.items)[this.tab]
        this.$router.push(this.$route.path + anchor)
      } else if (!isOpen && this.urlHasAnchor()) {
        this.$router.push(this.$route.path)
      }
    }
  },

  computed: {
    /**
     * Обьект стилей сайтбара
     * в зависимости от размеров экрана
     */
    styleObj() {
      return {
        top: this.mobBreakpoint
          ? '128px'
          : this.offsetTop > 65
          ? '66px'
          : '136px',
        width: this.mobBreakpoint
          ? '100%'
          : (document.body.clientWidth / 100) * this.widthPercent + 'px'
      }
    },
    ...mapGetters(['urlHasAnchor'])
  },

  watch: {
    value(newValue, oldValue) {
      this.onToggleSidebar(newValue)
    }
  }
}
</script>

<style lang="scss">
.da-sidebar {
  transition: all 0.3s ease, top 0.6s ease;
  &.v-navigation-drawer {
    z-index: 4 !important;
  }

  .sidebar-tabs .v-tabs-items .v-window-item {
    padding-bottom: 135px;
  }
}

@media all and (max-width: 960px) {
  .da-sidebar {
    &.v-navigation-drawer {
      z-index: 8 !important;
    }
  }
}
</style>
