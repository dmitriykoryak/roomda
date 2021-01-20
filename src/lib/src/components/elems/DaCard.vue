<template>
  <v-card class="da-card" :outlined="outlined" :color="color">
    <!-- Toolbar -->
    <v-toolbar v-show="!hideToolbar" class="pa-0" flat :height="height">
      <da-card-icon
        v-if="icon"
        :icon="icon"
        class="mr-3 card-icon"
        :color-class="iconColorClass"
        tile
      ></da-card-icon>
      <v-toolbar-title>
        <div v-if="title" class="toolbar-title">{{ title }}</div>
        <slot v-else name="title"></slot>
      </v-toolbar-title>

      <v-spacer v-if="!wideToolbar"></v-spacer>

      <v-toolbar-items
        :class="{ 'justify-end': wideToolbar }"
        :style="{ width: '100%' }"
      >
        <slot name="toolbar-items"></slot>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Toolbar конец -->

    <v-divider v-if="!hideToolbarDivider"></v-divider>

    <slot name="after-toolbar"></slot>

    <v-card-text class="pa-0">
      <slot></slot>
    </v-card-text>

    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import DaCardIcon from '~~/components/elems/DaCardIcon'

export default {
  name: 'da-card',
  components: {
    DaCardIcon
  },

  data: () => ({}),

  props: {
    title: String,
    icon: String,
    hideToolbarDivider: Boolean,
    // Растянуть toolbar-items на всю ширину toolbar панели
    wideToolbar: Boolean,
    hideToolbar: Boolean,
    iconColorClass: String,
    height: {
      type: [Number, String],
      default: 40
    },
    outlined: Boolean,
    color: String
  }
}
</script>

<style lang="scss">
.da-card {
  .toolbar-title {
    font-weight: bold;
  }
  .card-icon {
    margin-left: 10px;
  }

  & > .v-card__title {
    padding: 0 !important;
    min-height: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & > .v-toolbar {
    padding-left: 0;
    padding-right: 5px;

    & > .v-toolbar__content {
      padding-left: 0;
      padding-right: 5px;
    }

    .v-input {
      margin-top: 5px;
    }
  }
}
</style>
