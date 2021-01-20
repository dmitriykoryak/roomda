<template>
  <v-menu v-model="presetModel" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn fab small icon @click="presetModel = !presetModel">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>

    <v-list dense class="da-search-card-preset-list">
      <da-subheader icon="search" title="Сохраненный поиск" dark>
      </da-subheader>

      <!--кнопка Сохранить поиск-->
      <template v-if="!isEmptySearchItem">
        <v-list-item
          v-if="!savePresetVisibility"
          @click="savePresetVisibility = true"
          class="pl-1"
        >
          <v-list-item-avatar class="mx-0">
            <v-icon class="success--text">save</v-icon>
          </v-list-item-avatar>
          <v-list-item-title class="ml-3">
            Сохранить поиск
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-else>
          <v-text-field
            label="Название"
            v-model="searchPresetName"
            :error-messages="searchPresetError"
          ></v-text-field>
          <v-btn
            class="da-search-card-save-btn"
            @click.stop="saveSearchPreset()"
            icon
            fab
            small
          >
            <v-icon class="success--text">done</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <!--кнопка Сохранить поиск конец-->

      <v-list-item v-if="!searchPresets.length" class="pl-1">
        <v-list-item-avatar class="mx-0">
          <v-icon>label_off</v-icon>
        </v-list-item-avatar>
        <v-list-item-title class="ml-3">
          Нет сохраненного поиска
        </v-list-item-title>
      </v-list-item>

      <v-slide-x-reverse-transition group>
        <template v-for="(preset, index) in searchPresets">
          <v-divider :key="'d-' + index"></v-divider>

          <v-list-item
            :key="index"
            class="pl-1"
            @click="
              selectPreset(preset)
              presetModel = false
            "
          >
            <v-list-item-avatar class="mx-0">
              <v-icon>label</v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="ml-3">
              {{ preset.label }}
            </v-list-item-title>
            <v-list-item-action class="mx-0">
              <v-btn icon color="error" @click="delPreset(index)">
                <v-icon>close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-slide-x-reverse-transition>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'da-search-presets',

  mounted() {
    this.searchPresetKey = 'grid-search-pressers-' + this.mapKey
    this.getSearchPressers()
  },

  data: () => ({
    searchPresets: [],
    searchPresetName: null,
    searchPresetError: null,
    searchPresetKey: null,
    savePresetVisibility: false,
    presetModel: false
  }),

  props: {
    searchItem: Object,
    isEmptySearchItem: Boolean,
    mapKey: String
  },

  methods: {
    getSearchPressers() {
      this.searchPresets = this.storage.get(this.searchPresetKey) || []
    },

    saveSearchPreset() {
      this.searchPresetError = null
      // Валидация прессета ----------------------------------------
      if (!this.searchPresetName) {
        this.searchPresetError = 'Задайте название поиска'
        return
      }
      // проверка на уникальность имени прессета
      const index = this.searchPresets.findIndex(
        p => p.label === this.searchPresetName
      )
      if (index !== -1) {
        this.searchPresetError = 'Поиск с таким именем уже существует'
        return
      } //--------------------------------------------------------------

      let preset = {
        label: this.searchPresetName,
        searchItem: JSON.parse(JSON.stringify(this.localSearchItem))
      }

      this.searchPresets.push(preset)
      this.storage.set(this.searchPresetKey, this.searchPresets)

      this.$store.commit('DaSnackbar/show', {
        text: 'Поиск: ' + this.searchPresetName + ' - успешно сохранен'
      })

      this.searchPresetName = ''
      this.savePresetVisibility = false
      setTimeout(() => (this.presetModel = false), 700)
    },

    selectPreset(preset) {
      // для потери реактивности - Object.assign и оператор spread не работают - почему???
      this.localSearchItem = JSON.parse(JSON.stringify(preset.searchItem))
    },

    delPreset(index) {
      if (confirm('Вы уверены что хотите удалить сохраненный поиск?')) {
        this.searchPresets.splice(index, 1)
        this.storage.set(this.searchPresetKey, this.searchPresets)
      }
    }
  },

  computed: {
    localSearchItem: {
      get() {
        return this.searchItem
      },
      set(val) {
        this.$emit('update:searchItem', val)
      }
    },
    ...mapGetters(['storage'])
  }
}
</script>

<style lang="scss">
.da-search-card-preset-list {
  min-width: 220px;

  .da-search-card-save-btn {
    margin-right: -15px;
  }
}
</style>
