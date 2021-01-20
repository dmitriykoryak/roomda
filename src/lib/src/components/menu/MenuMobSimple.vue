<template>
  <div class="menu-mob-simple">
    <v-app-bar
      app
      color="#000000"
      dark
      src="https://source.unsplash.com/collection/2"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon>fa-bars</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <slot name="toolbar-title"></slot>
        <div class="flex-grow-1"></div>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <slot name="toolbar-right"></slot>
      </v-toolbar-items>

      <div class="progress">
        <v-progress-linear
          v-show="loading.active"
          :background-opacity="0"
          :indeterminate="loading.ind"
          :value="loading.progress"
        ></v-progress-linear>
      </div>
    </v-app-bar>

    <!--Боковой sidebar-->
    <v-navigation-drawer
      v-model="drawer"
      app
      left
      fixed
      :mini-variant.sync="mini"
    >
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          link
          :to="item.url"
          color="primary"
          :key="item.url"
          :exact="noAliasFix"
          @click="resetBadgeNumber(i), $emit('click:item')"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              <v-badge v-if="localBadges[i]" color="orange">
                <template v-slot:badge>{{ localBadges[i] }}</template>
                <span class="mr-2">{{ item.label }}</span>
              </v-badge>
              <template v-else>{{ item.label }}</template>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!--Боковой sidebar end-->

    <!--bottom-menu-->
    <v-bottom-navigation class="bottom-menu" app grow dark>
      <v-btn
        v-for="(item, i) in items"
        :key="item.url"
        :to="item.url"
        active-class="primary white--text"
        height="100%"
        large
        :exact="noAliasFix"
        @click="resetBadgeNumber(i), $emit('click:item')"
      >
        <v-badge v-if="localBadges[i]" color="orange">
          <template v-slot:badge>{{ localBadges[i] }}</template>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-badge>
        <v-icon v-else>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </v-bottom-navigation>
    <!--bottom-menu end-->
  </div>
</template>

<script>
/**
 * Меню
 * с запросом на пункты меню у Api - если массив itemsInit пустой
 */
import Vue from 'vue'
import MenuMixin from './MenuMixin'
import { mapState, mapGetters } from 'vuex'
import MenuWrapper from './MenuWrapper'

export default {
  name: 'menu-mob-simple',

  mixins: [MenuMixin],

  components: { MenuWrapper },

  created() {
    this.init()
  },

  props: {
    itemsInit: {
      type: Array,
      default: () => []
    },
    badges: Array,
    color: String,
    strucId: Number
  },

  data() {
    return {
      drawer: false,
      mini: false,
      items: []
    }
  },

  methods: {
    async init() {
      if (!this.itemsInit.length) {
        this.items = await this.getMenuStruc(this.strucId)
      }
    },
    /**
     * Обнулить число в barge для текущего пункта меню
     * @param i
     */
    resetBadgeNumber(i) {
      Vue.set(this.badges, i, undefined)
    }
  },

  computed: {
    localBadges: {
      get() {
        return this.badges
      },
      set(val) {
        this.$emit('update:badges', val)
      }
    },
    ...mapState({
      loading: state => state.Query.loading
    }),
    ...mapGetters(['storage'])
  }
}
</script>

<style lang="scss">
.menu-mob-simple {
  .v-navigation-drawer {
    background: linear-gradient(
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      ),
      url('//crm.web2.d2.dev.bshost.ru/assets/all/img/bg/menu.jpg') no-repeat;
    background-size: cover;
    .v-sheet {
      background: transparent;
    }
  }

  .v-list-item {
    margin: 7px;
  }

  .progress {
    position: absolute;
    min-height: 4px;
    width: 100vw;
    bottom: -4px;
    margin-left: -16px;
  }

  .logo-name {
    cursor: pointer;
  }
}

@media all and (min-width: 567px) {
  .menu-mob-simple {
    .bottom-menu {
      display: none !important;
    }
  }
}

@media all and (max-width: 567px) {
  .menu-mob-simple {
    .v-app-bar__nav-icon {
      display: none;
    }

    .v-navigation-drawer {
      display: none;
    }

    .v-toolbar__title {
      margin-left: -22px;
    }
  }
}
</style>
