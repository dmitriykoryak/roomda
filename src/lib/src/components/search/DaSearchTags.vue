<template>
  <div class="search-tags">
    <v-slide-x-reverse-transition group>
      <div
        v-for="(val, attr, index) in localSearchItem"
        :key="attr"
        @click="deleteValue(attr)"
      >
        <div v-if="isShowTag(attr, val)" class="d-flex align-center">
          <da-search-tag>
            <template v-slot:default="{ headStyle }">
              <template v-if="isList(mapKey, attr)">
                <span class="mr-1" :style="headStyle"
                  >{{ labels[attr] }}:
                </span>
                <da-preview-list
                  :item="searchItem"
                  :attr="attr"
                  :mapKey="mapKey"
                ></da-preview-list>
              </template>
              <template v-else-if="/dt|date|date_range/.test(rules[attr])">
                <span :style="headStyle">{{ labels[attr] }}: </span
                >{{ val | formatDT }}
              </template>
              <template v-else-if="/boolean/.test(rules[attr])">
                <span :style="headStyle">{{ labels[attr] }}: </span
                >{{ val | formatBoolean }}
              </template>
              <template v-else>
                <span :style="headStyle">{{ labels[attr] }}: </span>{{ val }}
              </template>
            </template>
          </da-search-tag>

          <v-btn
            v-if="index === searchItemLength - 1"
            icon
            color="red"
            @click="localSearchItem = {}"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    searchItem: Object,
    labels: Object,
    hideAttrs: {
      type: Array,
      default: function() {
        return []
      }
    },
    rules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    mapKey: String
  },

  methods: {
    deleteValue(attr) {
      Vue.delete(this.localSearchItem, attr)
    },

    isShowTag(attr, val) {
      const isArray = Array.isArray(val)
      return (
        ((isArray && val.length) || (!isArray && val)) &&
        this.hideAttrs &&
        !this.hideAttrs.includes(attr)
      )
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
    searchItemLength() {
      return Object.keys(this.localSearchItem).length
    },
    ...mapGetters(['isList'])
  }
}
</script>

<style scoped lang="scss">
.search-tags {
  display: flex;
  align-items: center;
  & > span {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-grow: 1;
    padding: 0 5px;
  }
}
</style>
