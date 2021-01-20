<template>
  <v-container class="pa-0 max-w-100">
    <v-row class="pa-0" dense>
      <template v-for="(i, attr) in iterable">
        <v-col
          v-if="
            ($vuetify.breakpoint.smAndDown ||
              ($vuetify.breakpoint.smAndUp && !fastfilter) ||
              (fastfilter && !fastfilter[attr])) &&
              !hideAttrs.includes(attr)
          "
          :key="attr"
          cols="12"
          sm="4"
          class="py-0"
        >
          <v-container
            class="radio-group"
            v-if="/boolean/.test(rule[attr])"
            fluid
          >
            <span class="radio-group-label">{{ labels[attr] }}</span>
            <v-radio-group class="mt-0" v-model="searchItem[attr]" row>
              <v-radio :label="`Неважно`" :value="null"></v-radio>
              <v-radio :label="`Нет`" value="0"></v-radio>
              <v-radio :label="`Да`" value="1"></v-radio>
            </v-radio-group>
          </v-container>

          <da-select
            v-else-if="isList(mapKey, attr)"
            v-model="searchItem[attr]"
            :attr="attr"
            :label="labels[attr]"
            :mapKey="mapKey"
            :apiUrl="apiUrl"
            :editedItem="searchItem"
            prependIcon="fa-list"
            :multiple="/each/.test(rule[attr])"
          ></da-select>

          <date-picker
            v-else-if="/date|dt_range/.test(rule[attr])"
            :attr="attr"
            v-model="searchItem[attr]"
            :label="labels[attr]"
            :multiple="/dt_range/.test(rule[attr])"
            prepend-icon="fa-calendar-alt"
            clearable
          ></date-picker>

          <date-time-picker
            v-else-if="/dt/.test(rule[attr])"
            :attr="attr"
            v-model="searchItem[attr]"
            :label="labels[attr]"
            prepend-icon="fa-calendar-alt"
            clearable
          ></date-time-picker>

          <da-phone-field
            v-else-if="/phone/.test(rule[attr])"
            v-model="searchItem[attr]"
            :attr="attr"
            :label="labels[attr]"
            clearable
          ></da-phone-field>

          <v-text-field
            v-else
            v-model="searchItem[attr]"
            :label="labels[attr]"
            prepend-icon="fa-search"
            clearable
          ></v-text-field>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    iterable: {
      type: Object,
      required: true
    },
    rule: {
      type: Object
    },
    searchItem: {
      type: Object,
      required: true
    },
    labels: {
      type: Object
    },
    apiUrl: {
      type: String,
      required: true
    },
    fastfilter: {
      type: Object
    },
    mapKey: {
      type: String,
      required: true
    },
    hideAttrs: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  computed: mapGetters(['isList'])
}
</script>
