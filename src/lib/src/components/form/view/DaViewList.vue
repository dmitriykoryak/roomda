<template>
  <div>
    <template v-if="!noTabs && objDepth(struc.view) > 1">
      <v-tabs show-arrows>
        <v-tab v-for="(attr, tabName, i) in struc.view" :key="i">
          {{ tabName }}
        </v-tab>

        <v-tab-item v-for="(attr, tabName, index) in struc.view" :key="index">
          <da-view-l
            :item="item"
            :coms="coms"
            :tooltips="tooltips"
            :labels="labels"
            :rules="rules"
            :iterable="attr.items"
            :mapKey="mapKey"
            :hideAttrs="hideAttrs"
          ></da-view-l>
        </v-tab-item>
      </v-tabs>
    </template>
    <template v-else>
      <da-view-l
        :item="item"
        :coms="coms"
        :tooltips="tooltips"
        :labels="labels"
        :rules="rules"
        :iterable="iterable"
        :mapKey="mapKey"
        :hideAttrs="hideAttrs"
      ></da-view-l>
    </template>
  </div>
</template>

<script>
/**
 * da-view-list для для просмотра в Grid (scenario: view)
 */
import { mapGetters } from 'vuex'
import DaViewL from '~~/components/form/view/_DaViewL.vue'

export default {
  name: 'da-view-list',
  components: {
    DaViewL
  },

  data: () => ({}),

  props: {
    coms: Object,
    tooltips: Object,
    labels: Object,
    struc: Object,
    rules: Object,
    item: Object,
    mapKey: String,
    noTabs: Boolean,
    // массив атрибутов, которые необходимо скрыть
    hideAttrs: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  computed: {
    iterable() {
      if (!this.noTabs) {
        return this.struc.view
      }

      let noTabsIterable = {}
      for (let [key, val] of Object.entries(this.struc.view)) {
        if (val.items) {
          noTabsIterable = { ...noTabsIterable, ...val.items }
        } else {
          noTabsIterable = { ...noTabsIterable, key: val }
        }
      }
      return noTabsIterable
    },
    ...mapGetters(['objDepth'])
  }
}
</script>

<style scoped lang="scss"></style>
