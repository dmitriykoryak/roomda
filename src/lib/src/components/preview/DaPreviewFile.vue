<template>
  <div class="da-preview-file js-no-row-actions-trigger">
    <div @click.stop="dialog = true">
      <da-thumbnail
        v-if="value[0]"
        :file="value[0]"
        :maxWidth="maxWidth"
        :maxHeight="maxHeight"
        :height="height"
        :width="width"
        :iconSize="30"
      ></da-thumbnail>
    </div>

    <!--Модальное окно показа изображения-->
    <v-dialog v-model="dialog" width="992">
      <da-card
        :title="value[showedIndex] && value[showedIndex].filename"
        icon="fa-file-image"
      >
        <v-carousel
          show-arrows-on-hover
          v-model="showedIndex"
          :show-arrows="value.length > 1"
          :hide-delimiter-background="value.length < 2"
          :hide-delimiters="value.length < 2"
        >
          <v-carousel-item v-for="(val, i) in value" :key="i">
            <v-sheet height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <da-youtube-player
                  v-if="val.type === 'video'"
                  :src="val.url"
                  ref="youtubePlayer"
                ></da-youtube-player>

                <v-img
                  v-else-if="val.thumb || val.url"
                  class="white--text"
                  :src="val.thumb || val.url"
                  height="100%"
                  contain
                >
                </v-img>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

        <template v-slot:actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text tile @click="dialog = false">
            Закрыть
          </v-btn>
        </template>
      </da-card>
    </v-dialog>
    <!--Модальное окно показа изображения end-->
  </div>
</template>

<script>
/**
 * Компонент для предпросмотра файлов и изображений
 */
import DaImg from '~~/components/elems/DaImg'

export default {
  name: 'da-preview-file',
  components: {
    DaImg
  },

  props: {
    value: Array,
    maxWidth: [String, Number],
    maxHeight: [String, Number],
    width: [String, Number],
    height: [String, Number]
  },

  data: () => ({
    dialog: false,
    showedIndex: 0
  }),

  methods: {
    stopVideo() {
      let players = this.$refs.youtubePlayer
      if (players) {
        players.forEach(player => player.stopVideo())
      }
    }
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.stopVideo()
      }
    },
    showedIndex() {
      this.stopVideo()
    }
  }
}
</script>
