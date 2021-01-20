<template>
  <component
    :is="component"
    class="tab-link"
    @click="addTab"
    :fixed="fixed"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :fab="fab"
    :rounded="rounded"
    :dark="dark"
    :color="color"
    :small="small"
    :text="text"
  >
    <slot></slot>
  </component>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { VBtn } from 'vuetify/lib'

export default {
  name: 'tab-link',
  components: {
    VBtn
  },
  data: () => ({}),

  inject: {
    windowId: {
      default: 0
    }
  },

  props: {
    to: String,
    noRoute: Boolean,
    windowId: Number,
    title: String,
    clearTabs: Boolean,
    level: {
      type: Number,
      default: 1
    },
    showCurrent: Boolean,
    component: {
      type: String,
      default: 'div'
    },
    color: {
      type: String,
      default: ''
    },
    fixed: Boolean,
    absolute: Boolean,
    top: Boolean,
    bottom: Boolean,
    right: Boolean,
    left: Boolean,
    fab: Boolean,
    rounded: Boolean,
    dark: Boolean,
    small: Boolean,
    text: Boolean,
    scenario: String
  },

  methods: {
    /**
     *  Добавить tabItem
     * */
    async addTab() {
      let tabsId = 0
      if (!this.noRoute) {
        this.$router.push(this.to)
      }

      if (this.clearTabs) {
        this.$store.commit('closeAllTabs', 0)
      }

      // Если включен режим 2 окна
      if (
        this.window.mode !== this.window.MODE_ONE_WINDOW &&
        !this.showCurrent
      ) {
        if (
          (this.windowId === 1 && !this.scenario) ||
          (this.scenario && this.scenario === 'search')
        ) {
          this.$store.dispatch('changeTabsId', { oldTabsId: 1, newTabsId: 0 })
        } else {
          this.$store.commit('closeAllTabs', 1)
        }
        tabsId = 1
      }

      const newTab = this.createTab(this.to, this.level, this.title)
      this.$store.dispatch('addTab', { tabsId, newTab })
    }
  },

  computed: {
    ...mapState({
      window: state => state.window || {}
    }),
    ...mapState(['prevRoute']),
    ...mapGetters({
      createTab: 'createTab'
    })
  }
}
</script>

<style lang="scss">
.tab-link {
  cursor: pointer;
}
</style>
