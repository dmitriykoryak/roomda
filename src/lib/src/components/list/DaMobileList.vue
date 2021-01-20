<template>
  <div>
    <da-list
      :title="title"
      :subheaderClass="subheaderClass"
      :loading="loading"
      :loaderRepeat="loaderRepeat"
    >
      <template v-for="(item, index) in items">
        <slot :name="'list-item-' + index" v-bind:on="bindedEvents(item)">
          <v-list-item @click="updateItem(item && item.attrs)">
            <v-list-item-avatar v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <div v-if="item.content && item.content.title">
                <span
                  v-if="item.content.isHtml"
                  v-html="item.content.title"
                ></span>
                <span v-else>
                  {{ item.content.title }}
                </span>
              </div>
              <v-list-item-subtitle
                v-if="item.content && item.content.subtitle"
              >
                {{ item.content.subtitle }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <template v-if="item.action">
              <v-list-item-action v-if="item.action.icon">
                <v-icon color="grey lighten-1">{{ item.action.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-action v-if="item.action.text">
                {{ item.action.text }}
              </v-list-item-action>
            </template>
          </v-list-item>
        </slot>

        <v-divider v-if="index !== items.length - 1"></v-divider>
      </template>
    </da-list>

    <!--Модальное окно-->
    <da-dialog
      v-model="dialog"
      fullscreen
      randImg
      leftArrow
      :title="title"
      :reRenderOnOpen="reRenderOnOpen"
    >
      <v-card tile>
        <template v-if="!showedFields">
          <slot
            :name="'list-item-dialog-' + index"
            v-for="(item, index) in items"
          ></slot>
        </template>
        <da-fields
          v-else
          :struc="struc"
          :editedItem.sync="localEditedItem"
          :labels="labels"
          :rules="rules"
          :scenario="'update'"
          :mapKey="mapKey"
          :apiUrl="apiUrl"
          :coms="coms"
          :showedFields="showedFields"
          :hide-tabs="hideTabs"
          :hide-groups="hideGroups"
          :hide-sum-validate-errors="hideSumValidateErrors"
        ></da-fields>

        <v-card-actions>
          <v-btn color="success" @click="saveItem" dark fixed bottom right fab>
            <v-icon>fa-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </da-dialog>
    <!--Модальное окно конец-->
  </div>
</template>

<script>
/**
 * Редактируемый список для моб. устройств
 */
import SetMixin from '~~/mixins/SetMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'da-mobile-list',

  mixins: [SetMixin],

  inject: ['$validator'],

  created() {
    this.init()
  },

  props: {
    items: Array,
    title: String,
    apiUrl: String,
    mapKey: String,
    reRenderOnOpen: Boolean,
    editedItem: {
      type: Object,
      default: () => {}
    },
    // Валидировать ли поля перед сохранением
    validate: {
      type: Boolean,
      default: true
    },
    hideTabs: Boolean,
    hideGroups: Boolean,
    hideSumValidateErrors: Boolean,
    loaderRepeat: {
      type: Number,
      default: 2
    },
    subheaderClass: String,
    loading: Boolean
  },

  data: () => ({
    dialog: false,
    localEditedItem: {},
    showedFields: []
  }),

  methods: {
    async init() {
      await this.fetchSet(this.apiUrl)
    },

    /**
     * Открыть на редактирование Item - только выбранные поля showedFields (они же - атрибуты)
     * @param showedFields
     */
    updateItem(showedFields) {
      this.$validator.reset()
      this.localEditedItem = { ...this.editedItem }
      this.showedFields = showedFields
      this.dialog = true
    },

    async saveItem() {
      if (this.validate && !(await this.$validator.validateAll())) return

      this.$emit('save:item', this.localEditedItem)
      this.dialog = false
    },
    bindedEvents(item) {
      let clickFunc = () => this.updateItem(item && item.attrs)
      return {
        click: clickFunc
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
