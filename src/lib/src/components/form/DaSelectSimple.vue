<template>
  <div style="width: 100%">
    <div
      @click.stop="
        $vuetify.breakpoint.smAndDown && !disabled && !modalOff
          ? (dialog = true)
          : ''
      "
    >
      <component
        :is="comName"
        class="da-select-simple"
        :value="localValue"
        @input="localValue = $event"
        :error-messages="errorMessages"
        :items="items"
        :label="label"
        :clearable="clearable"
        :prepend-icon="prependIcon"
        :append-outer-icon="appendOuterIcon"
        :no-data-text="noDataText"
        :multiple="multiple"
        :hint="hint"
        :chips="multiple"
        :small-chips="multiple"
        :deletable-chips="$vuetify.breakpoint.smAndUp && multiple"
        :loading="loading"
        :dense="dense"
        :solo="solo"
        :flat="flat"
        :single-line="singleLine"
        :hideDetails="hideDetails"
        :placeholder="placeholder"
        :disabled="disabled"
        :outlined="outlined"
        :full-width="fullWidth"
        :menu-props="{ offsetY: true }"
        :readonly="!!$vuetify.breakpoint.smAndDown && !modalOff"
        v-on="events"
      >
        <template v-if="withColors" v-slot:selection="{ item }">
          <slot name="selection" v-bind:item="item">
            {{ item.text }}
          </slot>
        </template>

        <template v-if="multiple" v-slot:prepend-item>
          <v-list-item ripple @click="allToggle">
            <v-list-item-action>
              <v-icon :color="localValue.length > 0 ? 'indigo darken-4' : ''">{{
                icon
              }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Выбрать все</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>
        </template>

        <template v-slot:item="{ item, attrs }">
          <slot name="item" v-bind:item="item">
            <!--чтобы не было ошибки slot is undefined-->
            <span
              v-if="!modalOff && $vuetify.breakpoint.smAndDown"
              class="d-none"
            ></span>
            <!--чтобы не было ошибки slot is undefined end-->
            <template v-else>
              <v-list-item-action v-if="multiple">
                <v-checkbox :input-value="attrs.inputValue"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </slot>
        </template>
      </component>
    </div>

    <!--Модальное окно select items-->
    <da-dialog
      v-model="dialog"
      fullscreen
      randImg
      leftArrow
      :title="label"
      :close-button="multiple"
      darkToolbar
    >
      <v-card tile>
        <v-text-field
          v-if="search"
          v-model="searchValue"
          hide-details
          prepend-inner-icon="search"
          class="mx-1"
        ></v-text-field>

        <v-list>
          <template v-if="multiple">
            <v-list-item ripple @click="allToggle">
              <v-list-item-action>
                <v-icon
                  :color="localValue.length > 0 ? 'indigo darken-4' : ''"
                  >{{ icon }}</v-icon
                >
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Выбрать все</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>

          <slot
            name="dialog-items"
            v-bind="{
              items,
              value: localValue,
              withColors,
              onClickItem: itm => itemToggle(itm)
            }"
          >
            <template v-for="(item, i) in items">
              <v-list-item
                v-show="
                  (search &&
                    item.text
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())) ||
                    !search
                "
                :ripple="false"
                :class="{ 'blue-grey': item.header }"
                @click="itemToggle(item)"
                :key="i"
                active-class="blue-grey--text"
                :input-value="
                  multiple
                    ? localValue.includes(item.value)
                    : localValue === item.value
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
                          ? localValue.includes(item.value)
                          : localValue === item.value
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
          </slot>
        </v-list>
      </v-card>
    </da-dialog>
    <!--Модальное окно select items конец-->
  </div>
</template>

<script>
import { VSelect, VAutocomplete } from 'vuetify/lib'
import { mapGetters } from 'vuex'

export default {
  name: 'da-select-simple',

  components: { VSelect, VAutocomplete },

  data: () => ({
    dialog: false,
    searchValue: ''
  }),
  props: {
    value: [String, Number, Array],
    attr: String,
    label: String,
    prependIcon: String,
    appendOuterIcon: String,
    multiple: Boolean,
    items: Array,
    errorMessages: String,
    hint: String,
    'no-data-text': String,
    loading: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    singleLine: Boolean,
    hideDetails: Boolean,
    fullWidth: Boolean,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    withColors: Boolean,
    outlined: Boolean,
    disabled: Boolean,
    search: Boolean,
    // отключить выбор итемов в модальном окне на smAndDown
    modalOff: Boolean
  },

  methods: {
    allToggle() {
      this.$nextTick(() => {
        if (this.likesAllItems) {
          this.localValue = []
        } else {
          this.localValue = this.items.map(item => item.value)
          //@todo удалить если в дальнейдем не будет ошибок валидации
          //this.validateField(this.$validator, this.attr, this.value, 100);
        }
      })
    },

    itemToggle(item) {
      let modelForReact = this.localValue

      if (this.multiple) {
        if (this.localValue.includes(item.value)) {
          const index = this.localValue.findIndex(v => v === item.value)
          modelForReact.splice(index, 1)
        } else {
          modelForReact.push(item.value)
        }
        this.localValue = modelForReact
      } else {
        this.localValue = item.value
        this.dialog = false
      }
      //@todo удалить если в дальнейдем не будет ошибок валидации
      // this.validateField(this.$validator, this.attr, this.value, 100);
      // // Костыль для validateScoped - без него неснимается ошибка валидации при выборе значения в модальном окне
      // if (this.$vuetify.breakpoint.smAndDown) {
      // 	setTimeout(() => this.$emit('blur'), 200);
      // }
    },

    getValues(array) {
      let out = []
      array.forEach(item => {
        if (item) {
          out.push(item)
        }
      })
      return out
    }
  },

  computed: {
    localValue: {
      get() {
        if (this.multiple) {
          let reactOut = []
          if (this.value) {
            this.value.forEach(val => reactOut.push(parseInt(val)))
          }
          return reactOut
        } else {
          const index = this.items.findIndex(item => {
            if (item.value) {
              return item.value == this.value
            }
          })
          return (this.items[index] && this.items[index].value) || ''
        }
      },
      set(value) {
        if (this.multiple) {
          this.$emit('input', this.getValues(value))
        } else {
          if (value === undefined) {
            value = ''
          }
          this.$emit('input', value)
        }
      }
    },
    itemsWithoutHeader() {
      return this.items.filter(item => !item.header)
    },
    likesAllItems() {
      return this.localValue.length === this.itemsWithoutHeader.length
    },
    likesSomeItem() {
      return this.localValue.length > 0 && !this.likesAllItems
    },
    icon() {
      if (this.likesAllItems) return 'mdi-close-box'
      if (this.likesSomeItem) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    comName() {
      return this.$vuetify.breakpoint.smAndUp &&
        (this.items.length > 10 || this.search)
        ? 'v-autocomplete'
        : 'v-select'
    },
    /**
     * Ивенты
     * @return {{"click:append-outer": (function(*=): (e|*))}}
     */
    events() {
      let out = {
        'click:append-outer': $event =>
          this.$emit('click:append-outer', $event),
        'click:clear': () => this.$emit('click:clear')
      }

      // на декстопе отключить всплытие события blur
      if (this.$vuetify.breakpoint.smAndUp) {
        out = { ...out, blur: $event => this.$emit('blur') }
      }
      return out
    },
    ...mapGetters(['validateField', 'resetField'])
  }
}
</script>

<style lang="scss">
.da-select-simple {
  .v-chip--disabled {
    color: rgba(0, 0, 0, 0.87) !important;
    opacity: 1 !important;
  }
}

.v-select-list {
  .v-subheader {
    font-size: 18px;
    color: #fff !important;
    background-color: #546e7a !important;
  }
}

.v-select__selections {
  min-height: 32px !important;
}
</style>
