<template>
  <div class="grid-wrapper">
    <grid
      v-if="renderCom"
      :style="{
        marginRight:
          sidebar && !mobBreakpoint ? `${$refs.sidebar.$el.style.width}` : 0
      }"
      :title="mapItem.label"
      :level="level"
      :mapKey="url.mapKey"
      :mapKeyFull="url.mapKeyFull"
      :parentAttr="parentAttr"
      :rowActions="mapItem['row-actions']"
      :pageActions="mapItem['page-actions']"
      :apiUrl="apiUrl"
      :siblings="mapItem['siblings']"
      :map="map"
      :leftWindow="leftWindow"
      :scenario="scenario"
      :editedItemInit="editedItemInit"
      :reloadSet="mapItem.set === 'reload'"
      :reloadData="reloadData"
      :setParams="mapItem['set-get'] || {}"
      :isSidebarBtn="!!mapItem.sidebar"
      :sidebar.sync="sidebar"
    ></grid>

    <da-sidebar
      v-if="!!mapItem.sidebar"
      v-model="sidebar"
      ref="sidebar"
      :items="mapItem.sidebar"
      :level="level"
      :apiUrl="apiUrl"
      :alias="url.alias"
      :map="map"
      :mob-breakpoint="mobBreakpoint"
    ></da-sidebar>

    <!--    Функционал для зависивмых слотов    -->
    <template v-if="depSlots.bottom">
      <v-card class="mx-auto" tile>
        <v-card-title>Заглушка</v-card-title>
        <v-card-text>Заглушка</v-card-text>
      </v-card>
    </template>
    <!--    Функционал для зависивмых слотов  end  -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'grid-wrapper',
  provide() {
    return {
      pathInit: this.pathInit
    }
  },
  inject: {
    windowId: { default: 0 },
    tabsId: { default: 0 }
  },
  created() {
    if (this.$store._mutations.changeWindowSwitcher) {
      this.$store.commit('changeWindowSwitcher', true)
    }
  },
  mounted() {
    this.init()
  },
  data: () => ({
    renderCom: false,
    testModel: [],
    drawer: true,
    sidebar: false
  }),
  props: {
    pathInit: String,
    apiUrl: String,
    noMap: Boolean,
    level: Number,
    editedItemInit: Object,
    scenarioInit: String,
    mapKeyInit: String,
    comName: String,
    reloadData: Boolean
  },
  methods: {
    async init() {
      await this.mapQuery()
      this.addTab()
      this.renderCom = true
    },

    async mapQuery() {
      if (this.noMap || !this._.isEmpty(this.map)) return

      const path = this.$route.path

      const url = this.apiUrl + '/' + this.firstLowerCase(this.comName) + '/map'
      const response = await this.query
        .get(url, null, true, true, null, false, true)
        .catch(() => {
          'не получен Map компонента' + this.$options.name
        })
      const map = response.data.data
      this.$store.commit('saveMap', { map, path })
    },

    /**
     * Создать дополнительные вкладки если:
     * Если одна вкладка и меньше и сценарий create, update, view
     * */
    addTab() {
      if (this.tabs.items.length > 1 || this.tabsId === 1) return

      let title
      if (this.scenario !== 'search') {
        if (this.scenario === 'create') {
          title = 'Создать'
        } else if (this.scenario === 'update') {
          title = 'Редактировать'
        } else if (this.scenario === 'view') {
          title = 'Просмотр'
        }
        const tabParams = {
          level: 2,
          title: title
        }
        this.$store.commit('changeTab', {
          tabsId: this.tabsId,
          index: 0,
          tabParams: tabParams
        })
        const addTab = this.createTab(
          '/' + this.url.alias + '/' + this.url.mapKey,
          1
        )
        this.$store.commit('unshiftTab', {
          tabsId: this.tabsId,
          newTab: addTab
        })
        this.$store.commit('changeTabPos', { tabsId: this.tabsId, pos: 'last' })
      }
    }
  },
  computed: {
    mobBreakpoint() {
      return this.$vuetify.breakpoint.smAndDown
    },
    parentAttr() {
      return this.mapItem && this.mapItem.parentAttr
    },
    leftWindow() {
      return !!(this.window && this.window.mode && this.windowId === 0)
    },
    url() {
      return this.$store.getters.url(
        this.pathInit,
        this.mapKeyInit || this.comName + '/default'
      )
    },
    map() {
      return this.maps[this.url.alias] || {}
    },
    mapItem() {
      for (let [key, mapItem] of Object.entries(this.map)) {
        if (this.url.mapKeyFull === key) {
          return mapItem
        }
      }
      return {}
    },
    scenario() {
      return this.mapItem.scenario || this.scenarioInit || 'search'
    },
    tabs() {
      return this.$store.state.TabState.tabs[this.tabsId]
    },
    ...mapState(['window']),
    ...mapState({
      depSlots: state => (state.SiteState && state.SiteState.depSlots) || {},
      maps: state => state.GridState.maps
    }),
    ...mapGetters(['firstLowerCase', 'query', 'createTab'])
  }
}
</script>

<style scoped lang="scss"></style>
