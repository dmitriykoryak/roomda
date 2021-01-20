<template>
  <div class="main-menu">
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="localMenu.drawer = !localMenu.drawer">
        <v-icon>fa-bars</v-icon>
      </v-app-bar-nav-icon>
      <span class="logo">
        <v-img
          v-if="$config.default.path.logo"
          :src="$conv($config.default.path.logo)"
          contain
        />
      </span>
      <!--			<v-toolbar-title>{{site.name}}</v-toolbar-title>-->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <da-search-button />
        <v-btn
          icon
          tile
          class="d-none d-md-block"
          @click="$store.dispatch('reRenderApp')"
        >
          <v-icon>autorenew</v-icon>
        </v-btn>
        <!-- <da-help :key="$route.path"></da-help> -->
        <v-btn
          class="d-none d-md-block"
          icon
          @click="localWindowMode = localWindowMode ? 0 : 1"
        >
          <v-icon>
            {{ localWindowMode ? 'looks_two' : 'looks_one' }}
          </v-icon>
        </v-btn>
      </v-toolbar-items>

      <v-divider vertical></v-divider>
      <slot name="toolbar-right"></slot>

      <div class="progress">
        <v-progress-linear
          v-show="loading.active"
          :background-opacity="0"
          :indeterminate="loading.ind"
          :value="loading.progress"
        ></v-progress-linear>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="localMenu.drawer"
      app
      left
      fixed
      :mini-variant.sync="localMenu.mini"
      mini-variant-width="62"
    >
      <div
        class="nav-top d-flex align-center"
        v-if="$vuetify.breakpoint.lgAndUp"
      >
        <v-img
          v-if="$config.default.path.logoMini"
          max-width="51"
          width="51"
          contain
          :src="$conv($config.default.path.logoMini)"
        />
        <v-spacer></v-spacer>
        <v-btn
          class="ml-4"
          v-if="$vuetify.breakpoint.mdAndUp"
          icon
          @click.stop="localMenu.mini = !localMenu.mini"
        >
          <v-icon small>fa-chevron-left</v-icon>
        </v-btn>
      </div>

      <slot name="drawer-top"></slot>

      <v-divider></v-divider>

      <v-list nav dense>
        <tab-link
          v-for="item in items"
          :key="item.label"
          :title="item.label"
          :to="item.url"
          noRoute
          clearTabs
          showCurrent
        >
          <v-list-item
            color="primary"
            :to="item.url"
            @click="
              clickItem()
              $vuetify.breakpoint.mdAndDown ? (localMenu.drawer = false) : ''
            "
            :exact="noAliasFix"
          >
            <v-list-item-action :style="{ minWidth: '30px' }">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </tab-link>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuMixin from './MenuMixin'
import MenuWrapper from './MenuWrapper'

export default {
  name: 'Menu',

  mixins: [MenuMixin],

  components: { MenuWrapper },

  created() {
    this.init()
  },

  data() {
    return {
      items: [],
      mini: false,
      right: null
    }
  },

  methods: {
    async init() {
      this.onResizeWindowEvent()
      this.items = await this.getMenuStruc()
    },
    onResizeWindowEvent() {
      window.onresize = () => {
        if (this.$vuetify.breakpoint.smAndDown) {
          this.localWindowMode = 0
        }
      }
    },
    clickItem() {
      this.$store.commit('changeWindowMode', this.window.MODE_ONE_WINDOW)
    }
  },

  computed: {
    localWindowMode: {
      get() {
        return this.window.mode
      },
      set(twoWindowOn) {
        // Управление вкладками при переключении режима окон
        if (twoWindowOn) {
          if (this.tabs[0] && this.tabs[0].items.length > 1) {
            this.$store.dispatch('changeTabsId', { oldTabsId: 0, newTabsId: 1 })
            this.$store.commit('changeWindowMode', this.window.MODE_TWO_WINDOW)
          } else {
            this.$store.commit(
              'changeWindowMode',
              this.window.MODE_HIDE_RIGHT_WINDOW
            )
          }
        } else {
          if (this.tabs[1] && this.tabs[1].items.length) {
            // если во втором окне была вкладка
            this.$store.dispatch('changeTabsId', { oldTabsId: 1, newTabsId: 0 })
          }
          this.$store.commit('changeWindowMode', this.window.MODE_ONE_WINDOW)
        }
      }
    },
    localMenu: {
      get() {
        return this.menu
      },
      set(val) {
        this.$store.commit('setMenu', val)
      }
    },
    ...mapState(['window']),
    ...mapState({
      tabs: state => state.TabState.tabs,
      loading: state => state.Query.loading,
      menu: state => state.MenuState.menu
    })
  }
}
</script>

<style lang="scss">
.main-menu {
  .logo {
    max-width: 130px;
  }

  .logo-mini {
    margin-left: -7px !important;
  }

  .v-navigation-drawer {
    background: linear-gradient(
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      ),
      url('//112.crm.v2.daxbax.ru/assets/all/img/bg/menu.jpg') no-repeat;
    background-size: cover;
    .v-sheet {
      background: transparent;
    }
  }

  .nav-top {
    padding: 5px 5px 0 5px;
  }

  .progress {
    position: absolute;
    min-height: 4px;
    width: 100vw;
    bottom: -4px;
    margin-left: -16px;
  }
}
</style>
