<template>
  <div class="da-search-card">
    <da-card
      :title="title"
      :icon="icon"
      :hideToolbarDivider="hideToolbarDivider"
      :wideToolbar="wideToolbar"
      :hideToolbar="hideToolbar"
      :outlined="outlined"
      :color="color"
    >
      <!-- Toolbar и Панель поиска -->
      <template v-slot:title>
        <slot name="title"></slot>
      </template>

      <template v-slot:toolbar-items>
        <slot name="toolbar-items"></slot>
        <template>
          <v-btn
            v-if="filterToolbarButton"
            :class="
              'da-search-card-filter-btn da-search-card-filter-btn-' + windowId
            "
            icon
            @click="
              $vuetify.breakpoint.smAndDown
                ? (dialog = true)
                : (searchPanel = searchPanel.length ? [] : [0])
            "
          >
            <v-icon small>fa-filter</v-icon>
          </v-btn>

          <v-menu v-if="dropdownToolbarButton" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn fab small icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <slot name="toolbar-dropdown"></slot>
          </v-menu>

          <slot name="toolbar-items-after"></slot>
        </template>
      </template>

      <template v-slot:after-toolbar>
        <da-fast-filter
          v-if="fastfilter"
          :search-item.sync="searchItem"
          :fastfilter="fastfilter"
          :rules="rules"
          :labels="labels"
          :map-key="mapKey"
        >
          <template v-slot:before>
            <slot name="before-fast-filter"></slot>
          </template>
        </da-fast-filter>

        <v-expansion-panels v-model="searchPanel" multiple accordion tile>
          <v-expansion-panel :key="0">
            <div class="d-flex align-center flex-nowrap">
              <!--Поисковые теги-->
              <da-search-tags
                :searchItem.sync="localSearchItem"
                :hideAttrs="fastfilter && Object.keys(fastfilter)"
                :labels="labels"
                :rules="rules.search"
                :mapKey="mapKey"
              ></da-search-tags>
              <!--Поисковые теги конец-->
            </div>

            <v-expansion-panel-content class="pa-0">
              <div class="e-panel-content-in">
                <slot name="search-items"></slot>
                <!--поисковые прессеты-->
                <div class="ml-2 e-panel-presets">
                  <da-search-presets
                    :searchItem.sync="localSearchItem"
                    :isEmptySearchItem="isEmptySearchItem"
                    :mapKey="mapKey"
                  />
                </div>
                <!--поисковые прессеты end-->
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <!-- Toolbar и Панель поиска конец -->

      <template v-slot:default>
        <slot name="default"></slot>
      </template>

      <template v-slot:actions>
        <slot name="actions"></slot>
      </template>
    </da-card>

    <!-- Модальное окно mobile search -->
    <da-dialog
      v-model="dialog"
      class="d-block d-md-none"
      title="Поиск"
      fullscreen
      leftArrow
      randImg
      close-button
      :close-icon="false"
    >
      <template v-slot:toolbar-items>
        <!--поисковые прессеты-->
        <da-search-presets
          :searchItem.sync="localSearchItem"
          :isEmptySearchItem="isEmptySearchItem"
        />
        <!--поисковые прессеты end-->
      </template>

      <v-card tile>
        <v-card-text style="padding-bottom: 100px">
          <slot name="search-items"></slot>
        </v-card-text>
      </v-card>
    </da-dialog>
    <!-- Модальное окно mobile search end -->
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DaCard from '~~/components/elems/DaCard.vue'

export default {
  name: 'da-search-card',
  components: {
    DaCard
  },

  inject: {
    windowId: {
      default: 0
    }
  },

  created() {
    this.storageKey = 'search-item-' + this.mapKey
    this.getSearchItemFromStorage()
    this.updateComState()
  },

  destroyed() {
    this.updateComState(true)
  },

  data() {
    return {
      searchPanel: [],
      dialog: false,
      storageKey: null
    }
  },

  props: {
    title: String,
    icon: String,
    rules: Object,
    searchItem: Object,
    labels: Object,
    fastfilter: Object,
    mapKey: String,
    hideToolbarDivider: Boolean,
    wideToolbar: Boolean,
    hideToolbar: Boolean,
    // показать кнопку кнопку меню тулбара
    dropdownToolbarButton: Boolean,
    // показать кнопку фильтра тулбара (поиска)
    filterToolbarButton: Boolean,
    parentAttr: String,
    parentId: [String, Number],
    outlined: Boolean,
    color: String
  },

  methods: {
    getSearchItemFromStorage() {
      const searchItem = this.storageLimit().get(this.storageKey)
      if (searchItem) {
        this.localSearchItem = searchItem
      }
    },

    updateComState(clear = false) {
      this.$store.commit('setSearchCard', {
        filterToolbarButton: clear ? false : this.filterToolbarButton
      })
    }
  },

  computed: {
    localSearchItem: {
      get() {
        return this.searchItem
      },
      set(val) {
        this.$emit('update:searchItem', val)
      }
    },
    isEmptySearchItem() {
      let isEmpty = true
      for (let [key, val] of Object.entries(this.localSearchItem)) {
        if (Array.isArray(val) && val.length) {
          isEmpty = false
        } else if (val) {
          isEmpty = false
        }
      }
      return isEmpty
    },
    ...mapGetters(['url', 'storageLimit'])
  },

  watch: {
    localSearchItem: {
      handler(newValue, oldValue) {
        // Сохранить поиск в localStorage на 12ч
        if (this.isEmptySearchItem) {
          this.storageLimit().delete(this.storageKey)
        } else {
          this.storageLimit(12 * 60 * 60).set(this.storageKey, newValue)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.da-search-card {
  .v-expansion-panel-content__wrap {
    padding: 12px;
  }

  .e-panel-content-in {
    padding-top: 10px;
    position: relative;

    .e-panel-presets {
      position: absolute;
      top: -10px;
      right: -7px;
    }
  }
}
</style>
