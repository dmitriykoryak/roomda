<template>
  <div>
    <div v-if="listItem" class="da-uploader-list-item">
      <div class="d-flex add">
        <v-spacer></v-spacer>
        <v-btn icon color="success" tile x-large @click="openUploadWindow">
          <v-icon>add</v-icon>
          <div :id="comId">
            <file-upload
              v-bind="bindAttrs"
              v-model="localValue"
              :inputId="'file-' + comId"
              @input-filter="inputFilter"
              @input-file="inputFile"
              @blur="$emit('blur')"
            ></file-upload>
          </div>
        </v-btn>
      </div>
      <template v-for="(category, index) in categoriesFull">
        <div
          v-if="
            (!category.isHide && notEmptyCatIds.includes(category.value)) ||
              category.value === null
          "
        >
          <v-divider v-if="!category.isHide && index !== 0" inset></v-divider>

          <v-subheader>{{
            'Файлы ' + (category.text.toLowerCase() || 'загруженные')
          }}</v-subheader>

          <v-slide-x-reverse-transition group>
            <template v-for="(file, i) in localValue">
              <template v-if="fileInCategory(file, category)">
                <v-list-item
                  :key="i"
                  @click.prevent="downloadFile(file.url, file.name)"
                >
                  <v-list-item-icon>
                    <da-thumbnail
                      :file="file"
                      :width="40"
                      :iconSize="30"
                    ></da-thumbnail>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ file.name }}</v-list-item-title>
                    <v-list-item-subtitle>12.02.2018</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="!category.isReadonly"
                      icon
                      color="error"
                      @click.stop="deleteFile(i, true)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </template>
          </v-slide-x-reverse-transition>
        </div>
      </template>
    </div>

    <da-preview-file
      v-else-if="mini"
      :value="localValue"
      width="50"
      height="30"
      :height="heightPreview"
    ></da-preview-file>

    <file-upload
      v-else-if="hidden"
      v-bind="bindAttrs"
      v-model="localValue"
      :inputId="'file-' + comId"
      @input-filter="inputFilter"
      @input-file="inputFile"
      @blur="$emit('blur')"
    >
      <slot v-bind="{ loading: $refs[comId] && $refs[comId].active }"></slot>
    </file-upload>

    <div v-else class="da-uploader-full max-w-100">
      <div class="uploader">
        <div class="d-flex max-w-100 align-center pa-2 header">
          <v-icon small class="mr-2">fa-arrow-up</v-icon>
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

          <div class="d-flex align-center files-in">
            <v-text-field
              v-if="!hideSearch && $vuetify.breakpoint.smAndUp"
              v-model="search"
              prepend-inner-icon="search"
              placeholder="Поиск"
              hide-details
              clearable
            ></v-text-field>
            <v-btn icon class="ml-1" @click="openUploadWindow">
              <v-icon>add</v-icon>
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <div>
          <file-upload
            class="btn btn-primary dropdown-toggle"
            v-bind="bindAttrs"
            v-model="localValue"
            :inputId="'file-' + comId"
            @input-filter="inputFilter"
            @input-file="inputFile"
            @blur="$emit('blur')"
          >
            <!--files container-->
            <v-container class="max-w-100" ref="container">
              <div
                v-if="!localValue.length"
                class="d-flex max-w-100 align-center grey--text caption"
              >
                Файлы не загружены
              </div>

              <!--items-->
              <template>
                <!-- Категории -->
                <template v-for="category in categoriesFull">
                  <v-subheader
                    v-if="
                      category.value && notEmptyCatIds.includes(category.value)
                    "
                    class="subheader"
                  >
                    {{ category.text }}
                  </v-subheader>
                  <v-row
                    class="pa-0"
                    :class="'items-wrapper-' + category.value"
                  >
                    <template v-for="(file, index) in localValue">
                      <template
                        v-if="!search || (search && file.name.includes(search))"
                      >
                        <v-col
                          v-if="fileInCategory(file, category)"
                          :key="index + file.name"
                          cols="12"
                          sm="6"
                          md="3"
                          @click.stop="
                            showedIndex = index
                            dialog = true
                          "
                        >
                          <file-card
                            :ref="'file-card-' + index"
                            :file="file"
                            :editedFile.sync="editedFile"
                            :categories="categories"
                            :index="index"
                            :errorMessage="errorMessage"
                            :hide-categories="hideCategories"
                            :hide-sort="!isPostAction"
                            @file:update="updateFile(index)"
                            @file:delete="deleteFile(index)"
                          >
                          </file-card>
                        </v-col>
                      </template>
                    </template>
                  </v-row>
                </template>
                <!-- Категории end -->
              </template>
              <!--items end-->
            </v-container>
            <!--files container end-->
          </file-upload>
          <div class="d-flex justify-end">
            <div class="caption mr-1">макс. размер файла: {{ maxSize }}Mb</div>
          </div>
        </div>
      </div>

      <!--Модальное окно показа изображения-->
      <v-dialog v-model="dialog" width="992">
        <da-card icon="fa-file-image">
          <template v-slot:title="file">
            <v-toolbar-title>{{
              localValue[showedIndex].name
            }}</v-toolbar-title>
          </template>

          <v-carousel
            show-arrows-on-hover
            v-model="showedIndex"
            :show-arrows="localValue.length > 1"
            :hide-delimiter-background="localValue.length < 2"
            :hide-delimiters="localValue.length < 2"
          >
            <v-carousel-item v-for="(file, i) in localValue" :key="i">
              <v-sheet height="100%">
                <v-row class="fill-height" align="center" justify="center">
                  <v-img
                    class="white--text"
                    v-if="file.thumb"
                    :src="file.thumb"
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
  </div>
</template>

<script>
import Vue from 'vue'
import ImageCompressor from '@xkeshi/image-compressor'
import { mapGetters, mapMutations } from 'vuex'
import FileUpload from 'vue-upload-component'
import FileCard from './_FileCard'
import DaPreviewFile from '~~/components/preview/DaPreviewFile'
import DaCard from '~~/components/elems/DaCard'
import axios from 'axios'

export default {
  name: 'da-uploader',
  components: {
    FileUpload,
    FileCard,
    DaPreviewFile,
    DaCard
  },
  props: {
    attr: String,
    id: [Number, String],
    errorMessages: String,
    label: String,
    scenario: String,
    // Тип внешнего вида
    mini: Boolean,
    listItem: Boolean,
    hidden: Boolean,

    value: Array,
    hideCategories: Boolean,
    hideSearch: Boolean,
    showFlashErrors: Boolean,
    // isPostAction = true - осуществлять отправку файла сразу же при его добавлении
    // isPostAction = false - файл не отправляется, а сохраняется в file.base64data
    isPostAction: {
      type: Boolean,
      default: true
    },
    ext: {
      type: Array,
      default: () => [
        'svg',
        'jpg',
        'jpeg',
        'png',
        'webp',
        'txt',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'pdf'
      ]
    },
    heightPreview: {
      type: [Number, String],
      default: 30
    },
    mapKey: String,
    // Загружается только один фаил и последующей перезаписью
    isOne: Boolean,
    // Максимальный размер загружаемого файла в Mb
    maxSize: {
      type: Number,
      default: 10
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      apiUrl: null,
      editedFile: {},
      categories: [],
      search: null,
      dialog: false,
      showedIndex: 0,
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      minSize: false,
      size: 0,
      multiple: true,
      drop: true,
      thread: 6,
      name: 'file',
      postAction: null,
      thumbUrl:
        'https://cdn.pixabay.com/photo/2014/05/26/09/44/icon-354339_960_720.png',
      headers: {
        'X-Csrf-Token': 'xxxx'
      },
      autoCompress: 1024 * 1024,
      uploadAuto: true,
      sortable: null,
      // Имеющиеся ID категорий в файлах
      availableCatIds: null,
      comId: '',
      randNum: null,
      files: []
    }
  },

  methods: {
    async init() {
      this.configInit()
      if (this.isPostAction) {
        this.sortInit()
      }
      if (!this.hideCategories) {
        await this.getCategories()
      }
    },

    configInit() {
      this.randNum = this.rand()
      this.size = 1024 * 1024 * this.maxSize
      this.comId = 'da-uploader-' + this.randNum
      this.apiUrl = this.$config.api.url.media
      if (this.isOne) {
        this.thread = 1
      }
      if (this.isPostAction) {
        this.postAction =
          this.apiUrl +
          '/file/default/create?k=' +
          this.$config.api.params.required.k +
          '&t=' +
          this.$config.api.params.required.t
      }
    },

    /**
     * Инициализация сортировки drag and drop
     * */
    sortInit() {
      this.categoriesFull.forEach(category => {
        let wrapper = document.querySelector(
          '.da-uploader-full .items-wrapper-' + category.value
        )
        this.defaultSortInit(
          wrapper,
          this.apiUrl + '/' + this.mapKey,
          this,
          'localValue',
          '.handle-selector'
        )
      })
    },

    async getCategories() {
      const response = await this.query.get(
        this.apiUrl + '/file/group/all-list',
        null,
        true,
        true
      )
      for (let [id, data] of Object.entries(response.data.data)) {
        this.categories.push({
          value: parseInt(id),
          text: data.label,
          isReadonly: data.is_readonly,
          isHide: data.is_hide
        })
      }
    },

    /**
     * Получить расширение файла
     * */
    getFileExt(fileName) {
      return fileName.split('.').pop()
    },

    /**
     * Получить индекс по имени файла
     * */
    getIndexByName(name) {
      return this.localValue.findIndex(file => file.name === name)
    },

    /**
     * Открыть окно выбора файла:
     * передать клик с иконки плюс на input#file в uploader
     * */
    openUploadWindow() {
      const elem = document.getElementById(this.comId)
      if (elem) {
        const el = elem.querySelector('#file-' + this.comId)
        el.click()
      }
    },

    /**
     * Фильтрация перед отправкой файла на сервер
     * pre filter
     * @param newFile
     * @param oldFile
     * @param prevent
     * @return {*}
     */
    async inputFilter(newFile, oldFile, prevent) {
      // Before adding a file
      if (newFile && !oldFile) {
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }

        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }

        // Автоматическая компресия
        this.compress(newFile)
      }

      // additional file params
      // Создать a blob, Thumbnails, category ets...
      this.createAdditionalParams(newFile, oldFile)

      if (!this.isPostAction) {
        await this.createBase64(newFile)
      }
    },

    async createBase64(file) {
      let blob = await fetch(file.blob).then(r => r.blob())
      var reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        let base64data = reader.result
        Vue.set(file, 'base64data', base64data)
      }
      return file
    },

    /**
     * Триггер-функция - срабатывающая при:
     * add, update, remove File Event
     * @param newFile
     * @param oldFile
     */
    inputFile(newFile, oldFile) {
      //Events
      if (newFile && oldFile) {
        // beforeSend
        if (newFile.active && !oldFile.active) {
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs[this.comId].update(newFile, { error: 'size' })
          }
        }
        // progress
        if (newFile.progress !== oldFile.progress) {
        }
        // error
        if (newFile.error && !oldFile.error) {
          const index = this.getIndexByName(newFile.file.name)
          if (this.showFlashErrors) {
            this.flashMsg({
              text: this.errorMessage(newFile.error),
              color: 'error',
              icon: 'error',
              hideBtn: true,
              timeout: 3000
            })
          }
          setTimeout(() => {
            this.delFile(index)
          }, 3000)
        }
        // success
        if (newFile.success && !oldFile.success) {
          //Обработка response
          if (newFile && newFile.xhr && newFile.xhr.response) {
            const response = JSON.parse(newFile.xhr.response)
            newFile.id = response.data.id
            newFile.group_id = response.data.group_id
            newFile.extension = response.data.extension
            newFile.temp = true
            this.clearCache()
          }
        }
      }

      // Automatically activate upload
      if (
        this.isPostAction &&
        (Boolean(newFile) !== Boolean(oldFile) ||
          oldFile.error !== newFile.error)
      ) {
        if (this.uploadAuto && !this.$refs[this.comId].active) {
          this.$refs[this.comId].active = true
        }
      }
    },

    /**
     * Создать доп file params
     **/
    createAdditionalParams(newFile, oldFile) {
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        if (!this.hideCategories) {
          newFile.category = newFile.category
            ? newFile.category
            : this.categories[0] && this.categories[0].value
        }
        newFile.description = ''
        if (this.isPostAction) {
          newFile.data = {
            name: newFile.name,
            sort: this.getIndexByName(newFile.name),
            type: newFile.type,
            rel: this.getRel,
            rel_id: this.id,
            attr: this.attr,
            category: newFile.category,
            description: newFile.description,
            isOne: this.isOne ? 1 : 0
          }
        }
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },

    /**
     * Компрессия
     * @param file
     */
    compress(file) {
      if (
        file.file &&
        file.type.substr(0, 6) === 'image/' &&
        this.autoCompress > 0 &&
        this.autoCompress < file.size
      ) {
        const imageCompressor = new ImageCompressor(null, {
          convertSize: Infinity,
          maxWidth: 512,
          maxHeight: 512
        })
        imageCompressor
          .compress(file.file)
          .then(f => {
            this.$refs[this.comId].update(f, {
              error: '',
              f,
              size: f.size,
              type: f.type
            })
          })
          .catch(err => {
            this.$refs[this.comId].update(f, {
              error: err.message || 'compress'
            })
          })
      }
    },

    async updateFile(index) {
      let file = { ...this.editedFile }
      if (!file.group_id) {
        file.group_id = null
      }
      if (this.isPostAction) {
        await this.query.put(this.apiUrl + '/file/default/' + file.id, file)
      }
      this.localValue[index] = { ...this.editedFile }
      this.$refs['file-card-' + index][0].toggleMenu(false)
      this.clearCache()
    },

    async deleteFile(index, confm = false) {
      const deleteFunc = async () => {
        const file = this.localValue[index]
        if (this.isPostAction) {
          await this.query.delete(this.apiUrl + '/file/default/' + file.id)
        }
        this.delFile(index)
        this.clearCache()
      }

      if (confm) {
        if (confirm(`Вы действительно хотите удалить фаил`)) {
          deleteFunc()
        }
      } else {
        deleteFunc()
      }
    },

    delFile(index) {
      this.localValue.splice(index, 1)
    },

    fileInCategory(file, category) {
      return (
        (!file.group_id && !category.value) || file.group_id === category.value
      )
    },

    /**
     * Очистить кеш запроса
     */
    clearCache() {
      this.$store.commit('clearQueryCache', this.cacheKey)
    },

    errorMessage(error) {
      if (error === 'size') {
        return `Максимальный размер файла: ${this.maxSize}Mb`
      } else if (error === 'extension') {
        return `Неподдерживаемый формат изображения`
      } else {
        return `Код ошибки: ${error}`
      }
    },

    // /**
    //  * @todo Проба сохранения
    //  */
    // downloadItem(url, label) {
    //   axios
    //     .get(url + '?t=1&k=1', { responseType: 'blob' })
    //     .then(response => {
    //       if (this.isMobileApp) {
    //         this.download(url)
    //       } else {
    //         const blob = new Blob([response.data], { type: 'application/png' })
    //         const link = document.createElement('a')
    //         link.href = URL.createObjectURL(blob)
    //         link.download = label
    //         link.target = '_blank'
    //         link.click()
    //         URL.revokeObjectURL(link.href)
    //       }
    //     })
    //     .catch(console.error)
    // },

    // /**
    //  * @todo Проба сохранения
    //  */
    // download(url) {
    //   //   var blob = new Blob([data], {
    //   //     type: mimeType
    //   //   })
    //   var storageLocation = ''

    //   switch (device.platform) {
    //     case 'Android':
    //       storageLocation = cordova.file.externalDataDirectory
    //       break

    //     case 'iOS':
    //       storageLocation = cordova.file.documentsDirectory
    //       break
    //   }

    //   var folderPath = storageLocation

    //   // we need to access LocalFileSystem
    //   window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(
    //     fs
    //   ) {
    //     // create the download directory is doesn't exist
    //     fs.root.getDirectory('Download', { create: true })

    //     console.log(fs.root.fullPath + '/Download/')

    //     let fileName = 'file.png'
    //     console.log(fileName)

    //     // we will save file in .. downloads/phonegap-logo.png
    //     var filePath = fs.root.fullPath + '/Download/' + fileName
    //     var fileTransfer = new window.FileTransfer()
    //     //var uri = encodeURI(decodeURIComponent(url))
    //     var uri = url

    //     fileTransfer.download(
    //       uri,
    //       filePath,
    //       function(entry) {
    //         alert(
    //           'Successfully downloaded file, full path is ' + entry.fullPath
    //         )
    //       },
    //       function(error) {
    //         console.log('Some error ' + error.code + ' for ' + url)
    //       },
    //       false
    //     )
    //   })
    // }

    // editedFileChanged(index) {
    //     return ((this.editedFile.name !== this.files[index].name)
    //         || (this.editedFile.category !== this.files[index].category)
    //         || (this.editedFile.description !== this.files[index].description));
    // },

    ...mapMutations({
      flashMsg: 'DaSnackbar/show'
    })
  },

  computed: {
    localValue: {
      get() {
        return this.scenario === 'create' ? this.files : this.value || []
      },
      set(val) {
        if (this.scenario === 'create') {
          this.files = val
        } else {
          this.$emit('input', val)
        }
      }
    },

    cacheKey() {
      'files' + this.attr + this.id
    },

    bindAttrs() {
      return {
        postAction: this.postAction,
        extensions: this.ext,
        multiple: this.multiple,
        size: this.size || 0,
        thread: this.thread,
        headers: this.headers,
        drop: this.drop,
        thumbUrl: this.thumbUrl,
        ref: this.comId,
        id: this.comId,
        maximum: this.thread
      }
    },

    extFull() {
      const upperCaseExt = this.ext.map(extention => extention.toUpperCase())
      return [...this.ext, ...upperCaseExt]
    },
    /**
     * Категории categories + категория без названия (для файлов: Без категории)
     */
    categoriesFull() {
      let copy = [...this.categories]
      copy.unshift({
        value: null,
        text: ''
      })
      return copy
    },

    notEmptyCatIds() {
      const forUpdate = this.localValue
      let out = []

      this.categoriesFull.forEach(category => {
        const catIds = this.localValue.map(f => f.group_id)
        if (catIds.includes(category.value)) {
          out.push(category.value)
        }
      })
      return out
    },

    urlsAndTitles() {
      return this.localValue.map(f => {
        return {
          thumb: f.thumb,
          title: f.filename,
          type: 'file'
        }
      })
    },
    getRel() {
      return this.getSet(this.mapKey).coms[this.attr].options.rel
    },
    ...mapGetters([
      'rand',
      'query',
      'defaultSortInit',
      'isMobileApp',
      'downloadFile',
      'getSet'
    ])
  },

  watch: {
    files: {
      handler(val) {
        const tempFileIds = val.map(file => {
          return {
            id: file.id,
            thumb: file.thumb
          }
        })
        this.$emit('input', tempFileIds)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.da-uploader-list-item {
  position: relative;
  .add {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.da-uploader-full {
  border: 1px solid #e0e0e0;

  .subheader {
    padding-left: 0;
    color: #1e88e5;
    height: 40px;

    &:before {
      content: '';
      display: block;
      width: 5px;
      height: 100%;
      background-color: #42a5f5;
      margin-right: 15px;
    }
  }

  .file-uploads {
    width: 100%;
    cursor: pointer;
  }

  .header {
    max-height: 40px;

    h3 {
      min-width: 50px;
      margin-right: 10px;
    }

    .files-in {
      max-width: 500px;

      .v-text-field {
        margin-top: -4px;
        min-width: 400px;
      }
    }
  }

  .uploader {
    height: 100%;
    width: 100%;
    transition: 0.3s;
    cursor: pointer;
  }
}

@media all and (max-width: (768px)) {
  .da-uploader-full {
    .header {
      .files-in {
        .v-text-field {
          min-width: auto;
        }
      }
    }
  }
}
</style>
