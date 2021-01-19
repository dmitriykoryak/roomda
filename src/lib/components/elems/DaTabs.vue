<template>
  <div class="da-tabs" v-if="tabs">
    <v-tabs
      v-model="tabModel"
      show-arrows
      :mandatory="false"
      icons-and-text
      dark
      :style="styleObj"
    >
      <v-tab v-for="(tab, index) in tabs.items" :key="index">
        {{
          tab.title ||
            (posContent(tab.path).config && posContent(tab.path).config.name)
        }}
        <v-icon>mdi-tab</v-icon>
        <div class="close-tab">
          <v-btn
            v-if="index !== 0"
            @click="closeTab(index, tab.level)"
            icon
            tile
            small
            color="white"
          >
            <v-icon small>close</v-icon>
          </v-btn>
        </div>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabModel">
      <v-tab-item
        :transition="false"
        :reverse-transition="false"
        v-for="(tab, index) in tabs.items"
        :key="index"
      >
        <slot>
          <component
            :is="posContent(tab.path).com"
            :key="tab.path"
            :level="tab.level"
            :pathInit="tab.path"
            :compare="compare"
          ></component>
        </slot>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'da-tabs',
  props: {
    tabsId: {
      type: Number,
      default: 0
    },
    startTabTitle: String
  },
  data() {
    return {}
  },
  created() {
    this.goOnHistoryEvent()
  },
  mounted() {
    this.createStartTabs()
  },
  provide() {
    return {
      tabsId: this.tabsId
    }
  },
  methods: {
    /**
     * Создать стартовую вкладку
     * Если сценарий create, update, view - создать доп. вкладку
     * */
    async createStartTabs() {
      if (this.tabs.items.length) {
        return
      }
      const startTab = this.createTab(
        this.$router.currentRoute.path,
        1,
        this.startTabTitle
      )
      this.$store.dispatch('addTab', { tabsId: this.tabsId, newTab: startTab })
    },

    /**
     * Закрыть вкладку
     * */
    closeTab(index, level) {
      this.$store.dispatch('closeAllRel', {
        tabsId: this.tabsId,
        level: level,
        index: index
      })
    },

    /**
     * Клик по tab - сменить path
     */
    clickOnTab() {
      const tabItem = this.tabs.items[this.tabModel]
      if (this.window.mode === this.window.MODE_ONE_WINDOW && tabItem) {
        if (this.$router.currentRoute.path !== tabItem.path) {
          this.$router.push(tabItem.path) // перейти
        }
      }
    },

    /**
     * Event переключение вкладок при нажатии кнопок браузера вперед / назад
     * */
    goOnHistoryEvent() {
      if (window.history && window.history.pushState) {
        window.onpopstate = () => {
          if (this.window.mode !== this.window.MODE_ONE_WINDOW) {
            return
          }

          const model = this.tabs.items.findIndex(tab => {
            return tab.path === this.$router.currentRoute.path
          })

          if (model !== -1) {
            this.$store.commit('changeTabModel', {
              tabsId: this.tabsId,
              index: model
            })
          } else {
            const newTab = this.createTab(this.$router.currentRoute.path, 1)
            this.$store.commit('addTab', {
              tabsId: this.tabsId,
              newTab: newTab
            })
          }
        }
      }
    },

    posContent(path) {
      return this.getCompare(path).content || {}
    }
  },
  computed: {
    tabModel: {
      get() {
        return this.tabs && this.tabs.model
      },
      set(val) {
        this.$store.commit('changeTabModel', {
          tabsId: this.tabsId,
          model: val
        })
      }
    },
    alias() {
      return this.url().alias
    },
    tabs() {
      return this.$store.state.TabState.tabs[this.tabsId]
    },
    styleObj() {
      return {
        background:
          'linear-gradient(' +
          this.hexToRGB(this.$vuetify.theme.themes.light.accent, 0.2) +
          ', ' +
          'rgba(0, 0, 0, 0.6)), ' +
          'url(../../../assets/all/img/bg/tabs.png)'
      }
    },
    compare() {
      return this.getCompare()
    },
    ...mapState({
      window: state => state.window || {}
    }),
    ...mapGetters(['url', 'createTab', 'hexToRGB', 'getCompare'])
  },
  watch: {
    tabs: {
      handler() {
        this.clickOnTab()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.da-tabs {
  .close-tab {
    position: absolute;
    top: 0;
    right: 0;
  }
  & > .v-tabs .v-item-group {
    background: none !important;
    .v-slide-group__prev,
    .v-slide-group__next {
      background: none;
    }
  }
}
</style>
