<template>
  <v-list>
    <template v-for="(val, attribute) in iterable">
      <template
        v-if="
          !hideAttrs.includes(attribute) &&
            val.is_many &&
            item[firstAttrInMany] &&
            item[firstAttrInMany].length
        "
      >
        <v-list-group value="true" class="blue lighten-5" color="blue darken-3">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-subtitle>{{ attribute }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <v-simple-table class="blue lighten-5">
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    v-for="(config, at) in val.items"
                    :key="at"
                    class="text-left"
                  >
                    {{ labels[at] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="firstAttrInMany && item[firstAttrInMany]">
                  <tr v-for="iter in item[firstAttrInMany].length">
                    <td v-for="(boolValue, at) in val.items" class="px-4">
                      <da-view-v
                        :item="item"
                        :value="item[at][iter - 1]"
                        :coms="coms"
                        :tooltips="tooltips"
                        :labels="labels"
                        :rule="rules.update"
                        :attr="at"
                        :mapKey="mapKey"
                        showIfDisabled
                        disabled
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
            </template>
          </v-simple-table>
        </v-list-group> </template
      ><!-- множественные данные -->

      <template v-else-if="val.items && isValsNotEmpty(val.items)">
        <v-list-group value="true">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-subtitle>{{ attribute }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-for="(config, attr) in val.items">
            <v-list-item
              v-if="item[attr] && !hideAttrs.includes(attr)"
              :key="attr"
            >
              <v-list-item-content>
                <v-list-item-subtitle>
                  <v-list-item-action-text
                    v-text="labels[attr]"
                  ></v-list-item-action-text>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <da-view-v
                  :item="item"
                  :value="item[attr]"
                  :coms="coms"
                  :tooltips="tooltips"
                  :labels="labels"
                  :rule="rules.update"
                  :attr="attr"
                  :mapKey="mapKey"
                  showIfDisabled
                  disabled
                />
              </v-list-item-action>
            </v-list-item>
            <da-view-v
              v-else
              :item="item"
              :value="item[attr]"
              :coms="coms"
              :tooltips="tooltips"
              :labels="labels"
              :rule="rules.update"
              :attr="attr"
              :mapKey="mapKey"
              showIfDisabled
              disabled
            />
          </template>
        </v-list-group>

        <v-divider></v-divider> </template
      ><!-- массивы данных -->

      <template
        v-else-if="
          !hideAttrs.includes(attribute) &&
            ((Array.isArray(item[attribute]) && item[attribute].length) ||
              (!Array.isArray(item[attribute]) && item[attribute]))
        "
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>
              <v-list-item-action-text
                v-text="labels[attribute] || attribute"
              ></v-list-item-action-text>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <da-view-value
              :item="item"
              :coms="coms"
              :tooltips="tooltips"
              :labels="labels"
              :rule="rules.update"
              :attr="attribute"
              :mapKey="mapKey"
              :iterable="val.items"
              showIfDisabled
              disabled
            />
          </v-list-item-action>
        </v-list-item>

        <v-divider></v-divider> </template
      ><!-- одностроковый вид данных -->
    </template>
  </v-list>
</template>

<script>
/**
 * da-view-l для для просмотра в Grid (scenario: view)
 */

export default {
  name: 'da-view-l',

  data: () => ({}),

  props: {
    iterable: Object,
    coms: Object,
    tooltips: Object,
    labels: Object,
    rules: Object,
    item: Object,
    mapKey: String,
    // массив атрибутов, которые необходимо скрыть
    hideAttrs: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  methods: {
    /**
     * Проверить значения в item на наличие данных
     */
    isValsNotEmpty(struc) {
      const attrs = Object.keys(struc)
      return attrs.every(attr => !!this.item[attr])
    }
  },

  computed: {
    firstAttrInMany() {
      let out
      for (let [attr, val] of Object.entries(this.iterable)) {
        if (val.is_many) {
          out = Object.keys(val.items)[0]
        }
      }
      return out
    }
  }
}
</script>
