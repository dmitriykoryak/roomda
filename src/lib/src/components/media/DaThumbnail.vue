<template>
  <div
    class="thumbnail d-flex align-center justify-center"
    :style="{ width: width + 'px', height: '100%' }"
  >
    <v-icon v-if="icon" :size="iconSize">
      {{ icon }}
    </v-icon>
    <v-card v-else outlined>
      <da-img
        :src="(file && file.thumb) || (file && file.url)"
        lazySrc=""
        :height="height"
        :maxHeight="maxHeight"
        :maxWidth="maxWidth"
        :width="width"
        cover
      >
      </da-img>
    </v-card>
  </div>
</template>

<script>
/**
 * img and thumbnail
 */
import DaImg from '~~/components/elems/DaImg'

export default {
  name: 'da-thumbnail',
  components: {
    DaImg
  },

  props: {
    file: {
      type: Object
    },
    height: [String, Number],
    width: [String, Number],
    maxWidth: [String, Number],
    maxHeight: [String, Number],
    iconSize: [String, Number],
    // Показать иконку вместо самого изображения
    imageIcon: Boolean,
    // Показать иконку отсутствия изображения
    noFileIcon: Boolean
  },

  computed: {
    icon() {
      const ext = this.file && this.file.extension
      if (/txt/.test(ext)) {
        return 'fa-file-alt'
      } else if (/doc/.test(ext)) {
        return 'fa-file-word'
      } else if (/xls/.test(ext)) {
        return 'fa-file-excel'
      } else if (/pdf/.test(ext)) {
        return 'fa-file-pdf'
      } else if (this.imageIcon && /jpg|jpeg|png|gif|ico/.test(ext)) {
        return 'fa-file-image'
      } else if (/rtf|csv|ppt|pps|odt|ods|odp|log/.test(ext)) {
        return 'fa-file'
      } else if (!this.file && this.noFileIcon) {
        return 'block'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
