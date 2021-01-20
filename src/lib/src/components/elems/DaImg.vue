<template>
  <v-img
    :key="src"
    :src="src"
    :class="imgClass"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :min-height="minHeight"
    :min-width="minWidth"
    :width="width"
    :height="height"
    :lazy-src="lazySrc"
    :contain="contain"
    :aspectRatio="aspectRatio"
    @click="$emit('click', $event)"
  >
    <template v-if="src" v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>

    <template v-slot:default>
      <slot></slot>
    </template>
  </v-img>
</template>

<script>
/**
 * Надстройка Image с progress bar
 * */
export default {
  name: 'da-img',
  props: {
    src: String,
    maxWidth: [String, Number],
    maxHeight: [String, Number],
    minHeight: [String, Number],
    minWidth: [String, Number],
    width: [String, Number],
    height: [String, Number],
    lazySrc: {
      type: String,
      default:
        'https://tahoban.ru/wp-content/themes/consultix/images/no-image-found-360x250.png'
    },
    contain: Boolean,
    imgClass: String,
    aspectRatio: [String, Number]
  },
  data: () => ({})
}
</script>
