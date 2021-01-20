<template>
  <div v-if="Array.isArray(item[attr])">
    <v-tooltip v-if="item[attr].length" bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">{{ getFirstListItem(mapKey, attr, item).label }}</span>
        <span v-if="item[attr].length > 1">...</span>
      </template>
      <span v-for="listId in item[attr]">
        - {{ getListItem(mapKey, attr, listId, item).label }}
        <br />
      </span>
    </v-tooltip>
  </div>

  <div v-else class="dt-tr-cell max-w-100 d-flex align-center">
    <div
      v-if="listItem.color"
      class="select-item-color mr-2 flex-shrink-0"
      :style="{ backgroundColor: listItem.color }"
    ></div>
    <span>
      {{ listItem.label }}
    </span>
  </div>
</template>

<script>
/**
 * Компонент для предпросмотра списков
 */
import { mapGetters } from 'vuex'

export default {
  name: 'da-preview-list',

  props: {
    item: Object,
    attr: String,
    mapKey: String
  },

  computed: {
    listItem() {
      return this.getListItem(
        this.mapKey,
        this.attr,
        this.item[this.attr],
        this.item,
        {}
      )
    },
    ...mapGetters(['getListItem', 'getFirstListItem'])
  }
}
</script>
