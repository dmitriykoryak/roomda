<template>
  <div class="da-view-v">
    <div v-if="/dt|date|date_range/.test(rule[attr])" class="da-view-v-cell">
      {{ value | formatDT }}
    </div>

    <!--	Цвет	-->
    <da-preview-color
      v-else-if="/color/.test(rule[attr])"
      :value="value"
      class="da-view-v-cell"
    ></da-preview-color>
    <!--	Цвет end	-->

    <da-preview-list
      v-else-if="isList(mapKey, attr)"
      :item="item"
      :attr="attr"
      :mapKey="mapKey"
      class="da-view-v-cell"
    ></da-preview-list>

    <component
      v-else-if="coms[attr]"
      :is="coms[attr].com"
      :value="value"
      :attr="attr"
      :mapKey="mapKey"
      :scenario="scenario"
      :id="item.id"
      :key="'key-' + value"
      mini
      class="da-view-v-cell"
      :heightPreview="heightPreviewFile"
    ></component>

    <!--	Switch	-->
    <da-switch
      v-else-if="/boolean/.test(rule[attr])"
      @input="
        $set(item, attr, $event)
        $emit('item:save', $event)
      "
      :value="value"
      :attr="attr"
      :tooltips="tooltips"
      :disabled="disabled"
      :showIfDisabled="showIfDisabled"
      dense
      denseTop
      hideDetals
      :icon-mode="disabled"
      class="da-view-v-cell"
    ></da-switch>
    <!--	Switch end	-->

    <!--	Значение - массив: показать tooltip	-->
    <da-preview-arr
      v-else-if="Array.isArray(value)"
      :value="value"
      :rule="rule"
      :attr="attr"
      class="da-view-v-cell"
    ></da-preview-arr>
    <!--	Значение - массив: показать tooltip end	-->

    <!--	html	-->
    <da-preview-html
      v-else-if="/html/.test(rule[attr]) || /text/.test(rule[attr])"
      :value="value"
      class="da-view-v-cell"
    >
    </da-preview-html>
    <!--	html end	-->

    <div v-else class="da-view-v-cell">
      {{ value }}
    </div>
  </div>
</template>

<script>
/**
 * Компонент для просмотра любого значения - посылаемого от Api
 */
import { mapGetters } from 'vuex'

export default {
  name: 'da-view-v',

  data: () => ({}),

  props: {
    item: Object,
    value: [Number, String, Boolean, Array],
    attr: String,
    coms: Object,
    tooltips: Object,
    labels: Object,
    rule: {
      type: Object,
      default: function() {
        return {}
      }
    },
    mapKey: String,
    scenario: String,
    disabled: Boolean,
    showIfDisabled: Boolean,
    heightPreviewFile: {
      type: [Number, String],
      default: 16
    }
  },

  computed: mapGetters(['isList'])
}
</script>

<style scoped lang="scss"></style>
