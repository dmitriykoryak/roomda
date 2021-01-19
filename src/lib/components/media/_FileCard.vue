<template>
  <v-card class="_file-preview" tile>
    <!--img and thumbnails-->
    <da-thumbnail :file="file" :height="150" :iconSize="100"></da-thumbnail>
    <!--img and thumbnails end-->

    <v-card-text class="pa-0">
      <div class="px-1 item-text">
        {{ file.name }}
      </div>

      <div>
        <div v-if="file.error" class="error--text font-weight-bold">
          {{ errorMessage(file.error) }}
        </div>
        <strong v-else-if="file.success" class="success--text">Загружен</strong>
        <strong v-else-if="file.active" class="info--text">Загрузка</strong>
      </div>
      <v-progress-linear
        v-if="file.active || file.progress !== '0.00'"
        :value="file.progress"
        :color="file.error ? 'error' : 'success'"
      ></v-progress-linear>
    </v-card-text>

    <!--actions panel-->
    <div class="actions">
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn v-if="!hideSort" icon class="handle-selector">
            <v-icon icon>
              touch_app
            </v-icon>
          </v-btn>
          <v-btn v-on="on" @click.stop="localEditedFile = { ...file }" icon>
            <v-icon icon>
              reorder
            </v-icon>
          </v-btn>
        </template>

        <v-card tile>
          <v-list>
            <v-list-item v-if="!hideCategories">
              <v-list-item-icon class="mr-4">
                <v-icon>category</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-select
                  v-model="localEditedFile.group_id"
                  :items="categories"
                  label="Категория"
                  hide-details
                  clearable
                >
                </v-select>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon class="mr-4">
                <v-icon>fa-file-signature</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-text-field
                  v-model="localEditedFile.name"
                  label="Название"
                  hide-details
                  clearable
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon class="mr-4">
                <v-icon>fa-file-alt</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-textarea
                  outlined
                  rows="3"
                  row-height="15"
                  v-model="localEditedFile.description"
                  label="Описание"
                  hide-details
                  clearable
                  auto-grow
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn small tile color="success" @click="$emit('file:update')">
              Сохранить
            </v-btn>

            <div class="flex-grow-1"></div>

            <v-btn
              fab
              icon
              small
              @click.prevent="
                $emit('file:delete')
                toggleMenu(false)
              "
            >
              <v-icon small>
                fa-trash
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <!--actions panel end-->
  </v-card>
</template>

<script>
/**
 * Шаблон для карточки файла в da-uploader
 */
import DaThumbnail from './DaThumbnail'

export default {
  name: 'file-card',
  components: {
    DaThumbnail
  },

  props: {
    file: Object,
    editedFile: Object,
    categories: Array,
    index: Number,
    hideCategories: Boolean,
    hideSort: Boolean,
    errorMessage: Function
  },

  data: () => ({}),

  methods: {
    toggleMenu(open = true) {
      this.$refs.menu.isActive = open
    }
  },

  computed: {
    localEditedFile: {
      get() {
        return this.editedFile
      },
      set(val) {
        this.$emit('update:editedFile', val)
      }
    }
  }
}
</script>

<style scoped lang="scss">
._file-preview {
  z-index: 4;
  position: relative;

  .thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;

    .v-icon {
      font-size: 110px;
    }
  }

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

    .v-btn {
      z-index: 6;
    }
  }
}
</style>
