<template>
  <v-toolbar
    :color="color"
    :dark="dark"
    :prominent="prominent"
    :src="randImg ? 'https://source.unsplash.com/collection/2' : ''"
    class="da-toolbar"
    :height="height"
  >
    <template v-if="randImg" v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.8)"
      ></v-img>
    </template>

    <v-btn
      v-if="leftArrow && prominent"
      icon
      :dark="dark"
      @click="$emit('dialog:close')"
    >
      <v-icon>keyboard_backspace</v-icon>
    </v-btn>

    <v-toolbar-items v-if="leftArrow && !prominent">
      <v-btn icon :dark="dark" @click="$emit('dialog:close')">
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
    </v-toolbar-items>

    <v-icon v-if="icon" class="mr-3">{{ icon }}</v-icon>

    <v-toolbar-title
      v-if="title"
      :class="{
        'flex-grow-1 text-center': titleCenter,
        'title-nudge-left': titleCenter && !closeIcon
      }"
      >{{ title }}</v-toolbar-title
    >
    <slot v-else name="title"></slot>

    <v-spacer v-if="spacer"></v-spacer>

    <slot></slot>

    <v-toolbar-items>
      <slot name="toolbar-items"></slot>
      <v-btn v-if="closeIcon" icon :dark="dark" @click="$emit('dialog:close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'da-toolbar',

  props: {
    title: String,
    // расположить title по центру
    titleCenter: Boolean,
    prominent: Boolean,
    dark: Boolean,
    color: String,
    randImg: Boolean,
    subItemName: String,
    dense: Boolean,
    leftArrow: Boolean,
    icon: String,
    closeIcon: {
      type: Boolean,
      default: true
    },
    spacer: {
      type: Boolean,
      default: true
    },
    height: [String, Number]
  },

  data: () => ({})
}
</script>

<style scoped lang="scss">
.da-toolbar {
  position: relative;
}
.title-nudge-left {
  // Добавить отступ влево на одну кнопку (центрировать title) если в da-toolbar справа нет кнопки закрыть модальное окно
  margin-left: -48px;
}
</style>
