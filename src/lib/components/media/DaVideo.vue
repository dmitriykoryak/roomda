<template>
  <div>
    <da-preview-file
      v-if="mini"
      :value="value"
      maxWidth="50"
      :height="heightPreview"
    ></da-preview-file>

    <div v-else class="da-video-full">
      <div class="video-wrapper elevation-0">
        <div class="d-flex max-w-100 align-center pa-2 header">
          <v-icon small class="mr-2">fa-video</v-icon>
          <v-slide-y-transition mode="out-in">
            <span
              v-if="errorMessages"
              class="error--text caption text-truncate"
            >
              {{ errorMessages }}
            </span>
            <h3 v-else class="grey--text text--darken-2 text-truncate">
              {{ label }}
            </h3>
          </v-slide-y-transition>
          <v-spacer></v-spacer>
          <div class="d-flex align-center video-in">
            <v-text-field
              v-model="addedUrl"
              :error-messages="error"
              placeholder="https://www.youtube.com/"
            ></v-text-field>
            <v-btn
              icon
              @click="addItem"
              class="ml-1"
              color="success"
              :disabled="!addedUrl"
            >
              <v-icon>done</v-icon>
            </v-btn>
          </div>
        </div>
        <v-divider></v-divider>

        <v-container class="max-w-100">
          <div
            v-if="!value.length"
            class="d-flex max-w-100 align-center grey--text caption"
          >
            Видео не загружены
          </div>

          <v-row class="pa-0">
            <v-col
              v-for="(item, index) in value"
              :key="index"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="item" tile>
                <v-img
                  @click="
                    showedIndex = index
                    dialog = true
                  "
                  class="white--text"
                  height="150px"
                  v-if="item.url"
                  :src="createThumb(item.url)"
                >
                </v-img>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn fab icon small @click="delItem(index, item)">
                    <v-icon small>
                      fa-trash
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-dialog v-model="dialog" v-if="value[showedIndex]" width="992">
        <da-card icon="fa-file-image">
          <template v-slot:title>
            Видео
          </template>

          <da-youtube-player
            :src="value[showedIndex].url"
            ref="youtubePlayer"
            width="100%"
          ></da-youtube-player>

          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              tile
              @click="
                dialog = false
                showedIndex = -1
              "
            >
              Закрыть
            </v-btn>
          </template>
        </da-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import config from '@/config/config'
import { mapGetters } from 'vuex'
import FileMixin from './FileMixin'
import DaCard from '~~/components/elems/DaCard.vue'
import DaYoutubePlayer from '~~/components/media/DaYoutubePlayer.vue'

export default {
  name: 'da-video',

  mixins: [FileMixin],

  components: { DaCard, DaYoutubePlayer },

  created() {
    this.comId = 'da-video-' + this.rand()
  },

  data: () => ({
    apiUrl: config.api.url.media,
    dialog: false,
    showedIndex: -1,
    addedUrl: '',
    error: null,
    comId: 0
  }),

  props: {
    attr: String,
    id: [Number, String],
    label: String,
    scenario: String,
    mapKey: String,
    mini: Boolean,
    value: Array,
    errorMessages: String,
    heightPreview: {
      type: [Number, String],
      default: 30
    }
  },

  methods: {
    /**
     * Добавить видео
     * @returns {Promise<string>}
     */
    async addItem() {
      const url = this.createUrl(this.addedUrl)

      if (!url) {
        return (this.error = 'Неправельный формат ссылки')
      }

      if (!this.isUnique(url))
        return (this.error = 'Видео с таким url уже существует')

      const params = {
        rel: this.getRel,
        rel_id: this.id,
        attr: this.attr,
        url
      }

      const response = await this.query.post(
        this.apiUrl + '/file/out/create',
        params
      )
      let valueCopy = [...this.value]
      valueCopy.push({
        url,
        id: response.data.data.id
      })
      this.$emit('input', valueCopy)
      this.afterChange()
      this.error = null
      this.addedUrl = ''
    },

    /**
     * Удалить видео
     * @returns {Promise<string>}
     */
    async delItem(index, item) {
      await this.query.delete(this.apiUrl + '/file/out/' + item.id)
      let valueCopy = [...this.value]
      valueCopy.splice(index, 1)
      this.$emit('input', valueCopy)
      this.afterChange()
    },

    createThumb(url) {
      let id = ''
      let thumb = ''
      if (url.includes('youtube')) {
        if (url.includes('embed')) {
          let parts = url.split('/')
          id = parts[parts.length - 1]
        } else {
          const found = /v=([^\&]+)/.exec(url)
          if (!found) return

          id = /v=([^\&]+)/.exec(url)[1]
        }
        thumb = 'https://img.youtube.com/vi/' + id + '/0.jpg'
      }
      //   else if (url.includes('vimeo')) {
      //      id = /\/(.*)$/.exec(url)[1];
      //      const response = await axios.get('http://vimeo.com/api/v2/video/' + id + '.xml');
      //      thumb = /\<thumbnail_medium\>(.*)\<\/thumbnail_medium\>/.exec(response.data)[1];
      //      url = 'https://player.vimeo.com/video/' + id;
      //   }
      else if (url.includes('youtu.be')) {
        let parts = url.split('/')
        id = parts[parts.length - 1]
        thumb = 'https://img.youtube.com/vi/' + id + '/0.jpg'
      } else {
        thumb = null
      }

      return thumb
    },

    createUrl(url) {
      if (url.includes('youtu.be')) {
        let parts = url.split('/')
        const id = parts[parts.length - 1]
        return 'https://www.youtube.com/watch?v=' + id
      } else if (url.includes('youtube')) {
        return url
      } else {
        return
      }
    },

    /**
     * Очистить кеш запроса
     */
    clearCache() {
      this.$store.commit('clearQueryCache', this.cacheKey)
    },

    isUnique(url) {
      const index = this.value.findIndex(video => video.url === url)
      return index === -1
    }
  },

  computed: {
    cacheKey() {
      'video' + this.attr + this.id
    },
    getRel() {
      return this.getSet(this.mapKey).coms[this.attr].options.rel
    },
    ...mapGetters(['query', 'rand', 'getSet'])
  },

  watch: {
    dialog(val) {
      if (!val && this.$refs.youtubePlayer) {
        this.$refs.youtubePlayer.stopVideo()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.da-video-full {
  height: 100%;
  width: 100%;
  transition: 0.3s;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.875rem;
  line-height: 1.375rem;
  letter-spacing: 0.0071428571em;
  border: 1px solid #e0e0e0;

  .video-wrapper {
    transition: all 0.3s ease-in-out;
  }

  .header {
    max-height: 40px;

    h3 {
      min-width: 50px;
      margin-right: 10px;
    }
  }

  .video-in {
    max-width: 500px;

    .v-input {
      margin-top: 30px;
      padding: 0;
      min-width: 450px;
    }
  }

  .item {
    z-index: 3;
    position: relative;

    .item-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions {
      padding: 3px 5px;
      max-width: 300px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 6;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}

@media all and (max-width: 768px) {
  .da-video-full {
    .video-in {
      .v-input {
        min-width: auto;
      }
    }
  }
}
</style>
