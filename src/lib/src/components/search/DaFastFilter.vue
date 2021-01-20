<template>
  <div>
    <v-sheet class="da-fast-filter d-flex" width="100%" height="40">
      <div class="ml-2 mr-1">
        <slot name="before"></slot>
      </div>

      <v-slide-group show-arrows class="h-100">
        <template v-for="(config, attr, attrIndex) in fastfilter">
          <v-divider vertical v-if="attrIndex !== 0"></v-divider>

          <template v-if="getList(mapKey, attr)">
            <!--mobile btns-->
            <div
              v-if="$vuetify.breakpoint.xs && Object.keys(fastfilter) > 1"
              class="text-center fast-filter-mobile"
            >
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <div class="d-flex align-center h-100">
                    <v-btn class="h-100" text small v-on="on" tile>
                      <span v-show="notSelectedFastFilter">
                        {{ labels[attr] }}
                      </span>
                      <template
                        v-for="(item, id, index) in getList(mapKey, attr)
                          .itemsDepth01"
                      >
                        <span
                          v-if="isSelectedBtn(attr, id)"
                          :style="{
                            borderBottom: item.color
                              ? '2px solid ' + item.color
                              : 'none'
                          }"
                          class="overline ml-1"
                        >
                          {{ item.label }}
                        </span>
                      </template>
                    </v-btn>
                  </div>
                </template>

                <v-list :min-width="300">
                  <v-subheader>{{ labels[attr] }}</v-subheader>

                  <template v-if="isList(mapKey, attr)">
                    <template
                      v-for="(item, id, index) in getList(mapKey, attr).items"
                    >
                      <v-divider v-if="index !== 0"></v-divider>

                      <v-list-group v-if="item.items">
                        <template v-slot:activator>
                          <v-list-item-content>
                            <v-list-item-title
                              >{{ item.label }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>

                        <v-list-item
                          v-for="(itm, ind) in item.items"
                          active-class="primary--text"
                          class="pl-1"
                          :key="ind"
                          @click="fastFilterClick(attr, ind)"
                          :input-value="isSelectedBtn(attr, ind)"
                        >
                          <v-list-item-avatar v-if="itm.color" class="mx-0">
                            <div
                              class="fast-filter-circle"
                              :style="{ backgroundColor: itm && itm.color }"
                            ></div>
                          </v-list-item-avatar>
                          <v-list-item-title class="ml-3">
                            {{ itm && itm.label }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list-group>

                      <template v-else>
                        <v-list-item
                          active-class="primary--text"
                          class="pl-1"
                          :key="index"
                          @click="fastFilterClick(attr, id)"
                          :input-value="isSelectedBtn(attr, id)"
                        >
                          <v-list-item-avatar v-if="item.color" class="mx-0">
                            <div
                              class="fast-filter-circle"
                              :style="{ backgroundColor: item && item.color }"
                            ></div>
                          </v-list-item-avatar>
                          <v-list-item-title class="ml-3">
                            {{ item && item.label }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </template>
                  </template>
                </v-list>
              </v-menu>
            </div>
            <!--mobile btns-->

            <!--desktop btns-->
            <template
              v-else-if="
                $vuetify.breakpoint.xs ||
                  Object.keys(getList(mapKey, attr).items).length > 1
              "
            >
              <v-slide-item
                v-for="(item, id, index) in getList(mapKey, attr).items"
                v-slot:default="{ active, toggle }"
              >
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <div class="h-100">
                      <v-btn class="h-100" text small v-on="on" tile>
                        <span>
                          {{ item.label }}
                        </span>
                        <template v-for="(itm, ind, i) in item.items">
                          <span
                            v-if="isSelectedBtn(attr, ind)"
                            :style="{
                              borderBottom: itm.color
                                ? '2px solid ' + itm.color
                                : 'none'
                            }"
                            class="overline ml-1"
                          >
                            {{ itm.label }}
                          </span>
                        </template>
                        <v-icon right dark>arrow_drop_down</v-icon>
                      </v-btn>
                    </div>
                  </template>

                  <v-list>
                    <template v-for="(itm, ind, i) in item.items">
                      <v-divider v-if="i !== 0"></v-divider>

                      <template>
                        <v-list-item
                          active-class="primary--text"
                          class="pl-1"
                          :key="i"
                          @click="fastFilterClick(attr, ind)"
                          :input-value="isSelectedBtn(attr, ind)"
                        >
                          <v-list-item-avatar v-if="itm.color" class="mx-0">
                            <div
                              class="fast-filter-circle"
                              :style="{ backgroundColor: itm && itm.color }"
                            ></div>
                          </v-list-item-avatar>
                          <v-list-item-title class="ml-3">
                            {{ itm && itm.label }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </template>
                  </v-list>
                </v-menu>
              </v-slide-item>
            </template>

            <template v-else>
              <v-slide-item
                v-for="(item, id, index) in getList(mapKey, attr).itemsDepth01"
                v-slot:default="{ active, toggle }"
              >
                <v-btn
                  class="h-100 fast-filter-desktop-btn darken-4"
                  small
                  text
                  tile
                  v-blur
                  :style="{
                    borderBottom: item.color
                      ? '2px solid ' + item.color + '!important'
                      : 'none',
                    borderTop:
                      item.color && isSelectedBtn(attr, id)
                        ? '2px solid ' + item.color
                        : '2px solid transparent',
                    color: isSelectedBtn(attr, id) ? item.color : ''
                  }"
                  @click="fastFilterClick(attr, id)"
                  :input-value="isSelectedBtn(attr, id)"
                >
                  <span
                    :class="
                      isSelectedBtn(attr, id)
                        ? 'black--text'
                        : 'grey--text text--darken-2'
                    "
                  >
                    {{ item && item.label }}
                  </span>
                </v-btn>
              </v-slide-item>
            </template>
          </template>
          <!--desktop btns end-->
        </template>
      </v-slide-group>
      <div class="flex-grow-1"></div>
    </v-sheet>
    <v-divider></v-divider>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'da-fast-filter',

  data: () => ({}),

  props: {
    fastfilter: Object,
    searchItem: Object,
    rules: Object,
    labels: Object,
    mapKey: String
  },

  methods: {
    /**
     * Клик по кнопке  fast filter
     * */
    fastFilterClick(attr, id) {
      id = parseInt(id)

      if (this.isMultiple(attr)) {
        // если мультивыбор по атрибуту
        if (
          this.localSearchItem[attr] &&
          this.localSearchItem[attr].includes(id)
        ) {
          const index = this.localSearchItem[attr].findIndex(i => i === id)
          Vue.set(this.localSearchItem, attr, [])
        } else {
          if (!this.localSearchItem[attr]) {
            Vue.set(this.localSearchItem, attr, [])
          }
          this.localSearchItem[attr].push(id)
        }
      } else {
        // если одиночный выбор
        if (this.localSearchItem[attr] === id) {
          Vue.set(this.localSearchItem, attr, null)
        } else {
          Vue.set(this.localSearchItem, attr, id)
        }
      }
    },

    /**
     * Если в searchItem[attr] есть такой id - подсветить btn(selected)
     * */
    isSelectedBtn(attr, id) {
      id = parseInt(id)
      return /each/.test(this.rules.search[attr])
        ? this.localSearchItem[attr] && this.localSearchItem[attr].includes(id)
        : this.localSearchItem[attr] === id
    },

    /**
     * Множественный выбор fastfilter - вернуть true
     * @param attr
     * @returns {boolean}
     */
    isMultiple(attr) {
      return /each/.test(this.rules.search[attr])
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
    notSelectedFastFilter() {
      let notSelected = true
      for (let [attr, notUsedVal] of Object.entries(this.fastfilter)) {
        if (
          (this.isMultiple(attr) &&
            this.localSearchItem[attr] &&
            this.localSearchItem[attr].length) ||
          (!this.isMultiple(attr) && this.localSearchItem[attr])
        ) {
          notSelected = false
        }
      }
      return notSelected
    },
    ...mapGetters(['isList', 'getList'])
  }
}
</script>

<style lang="scss">
.da-fast-filter {
  .fast-filter-mobile {
    .menu-btn-append {
      font-size: 9px;
      color: #5b5b5b;
      margin-left: 10px;
    }
  }

  .fast-filter-desktop-btn {
    border: none;
  }
}

.fast-filter-circle {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
</style>
