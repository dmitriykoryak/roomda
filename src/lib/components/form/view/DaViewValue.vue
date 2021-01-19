<template>
  <div>
    <div v-if="iterable">
      <template v-for="(booleanVal, at) in iterable">
        <da-view-v
          :class="innerClass"
          :attr="at"
          :item="item"
          :value="item[at]"
          :coms="coms"
          :tooltips="tooltips"
          :rule="rule"
          :mapKey="mapKey"
          :scenario="scenario"
          :heightPreviewFile="heightPreviewFile"
          :disabled="disabled"
          :listItem="listItem"
          @item:save="$emit('item:save')"
        ></da-view-v>
      </template>
    </div>
    <template v-else>
      <da-view-v
        :class="innerClass"
        :attr="attr"
        :item="item"
        :value="item[attr]"
        :coms="coms"
        :tooltips="tooltips"
        :rule="rule"
        :mapKey="mapKey"
        :scenario="scenario"
        :heightPreviewFile="heightPreviewFile"
        :disabled="disabled"
        :listItem="listItem"
        @item:save="$emit('item:save')"
      ></da-view-v>
    </template>
  </div>
</template>

<script>
import DaViewV from '~~/components/form/view/_DaViewV.vue'

export default {
  components: {
    DaViewV
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    attr: {
      type: String,
      required: true
    },
    mapKey: {
      type: String,
      required: true
    },
    scenario: String,
    coms: Object,
    tooltips: Object,
    rule: Object,
    innerClass: String,
    labels: Object,
    disabled: Boolean,
    showIfDisabled: Boolean,
    iterable: Object,
    heightPreviewFile: {
      type: [Number, String],
      default: 16
    },
    listItem: Boolean
  }
}
</script>

<style lang="scss" scoped></style>
