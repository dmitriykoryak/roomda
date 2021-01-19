<template>
  <da-select-simple
    :value="value"
    @input="$emit('input', $event)"
    :attr="attr"
    :label="label"
    :items="items"
    :outlined="outlined"
    :dense="dense"
    :hide-details="hideDetails"
    :tile="tile"
    :clearable="clearable"
    :multiple="multiple"
  >
    <template v-slot:dialog-items="{ items, value, withColors, onClickItem }">
      <template v-for="(item, i) in items">
        <template v-if="item.isMain">
          <v-list-item
            :ripple="false"
            :class="{ 'blue-grey': item.header }"
            @click="onClickItem(item)"
            :key="i"
            active-class="blue-grey--text"
            :input-value="
              multiple ? value.includes(item.value) : value === item.value
            "
          >
            <v-list-item-content v-if="item.header">
              <v-list-item-title class="white--text title">{{
                item.header
              }}</v-list-item-title>
            </v-list-item-content>
            <template v-else>
              <v-list-item-action
                v-if="multiple"
                :style="{ marginRight: withColors ? '18px' : '32px' }"
              >
                <v-checkbox
                  color="blue-grey"
                  :input-value="
                    multiple ? value.includes(item.value) : value === item.value
                  "
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-avatar v-if="item.color">
                <div
                  class="select-item-color"
                  :style="{ backgroundColor: item.color }"
                ></div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
          <v-divider v-if="i < items.length - 1"></v-divider>
        </template>
      </template>

      <v-fade-transition>
        <div v-if="showMore">
          <template v-for="(item, i) in items">
            <template v-if="!item.isMain">
              <v-list-item
                :ripple="false"
                :class="{ 'blue-grey': item.header }"
                @click="onClickItem(item)"
                :key="i"
                active-class="blue-grey--text"
                :input-value="
                  multiple ? value.includes(item.value) : value === item.value
                "
              >
                <v-list-item-content v-if="item.header">
                  <v-list-item-title class="white--text title">{{
                    item.header
                  }}</v-list-item-title>
                </v-list-item-content>
                <template v-else>
                  <v-list-item-action
                    v-if="multiple"
                    :style="{ marginRight: withColors ? '18px' : '32px' }"
                  >
                    <v-checkbox
                      color="blue-grey"
                      :input-value="
                        multiple
                          ? value.includes(item.value)
                          : value === item.value
                      "
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar v-if="item.color">
                    <div
                      class="select-item-color"
                      :style="{ backgroundColor: item.color }"
                    ></div>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="i < items.length - 1"></v-divider>
            </template>
          </template>
        </div>
      </v-fade-transition>

      <v-btn
        color="primary"
        class="mt-3"
        block
        depressed
        small
        @click="showMore = !showMore"
      >
        <span v-if="showMore">
          <v-icon left>mdi-arrow-up</v-icon> Скрыть еще
        </span>
        <span v-else> <v-icon left>mdi-arrow-down</v-icon> Показать еще </span>
      </v-btn>
    </template>
  </da-select-simple>
</template>

<script>
/**
 * Селект - надстройка над da-select-simple
 * - с кнопкой "Показать/Скрыть еще" в модальном окне(viewport=smAndDown)
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    value: [String, Number, Array],
    attr: String,
    label: String,
    apiUrl: String,
    mapKey: String,
    outlined: Boolean,
    dense: Boolean,
    hideDetails: Boolean,
    tile: Boolean,
    clearable: Boolean,
    multiple: Boolean
  },
  data() {
    return {
      items: [],
      showMore: false
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    async fetchItems() {
      const response = await this.query.get(
        `${this.apiUrl || this.$config.api.url.crm}/${this.mapKey}`,
        {
          limit: 50
        },
        true,
        true
      )

      this.items = response.data.data.map(item => {
        return {
          value: item.id,
          text: item.label,
          isMain: item.is_main
        }
      })
    }
  },
  computed: {
    ...mapGetters(['query'])
  }
}
</script>
