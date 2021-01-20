<template>
  <v-bottom-sheet v-model="localValue" scrollable>
    <v-list dense :style="{ overflowY: 'auto' }">
      <v-subheader>Действия</v-subheader>

      <template v-for="path in rowActions">
        <template v-if="map[path].type && map[path].type === 'link-ajax'">
          <v-list-item
            @click="
              localValue = false
              $emit('notification:send', { path: path, id: editedItem.id })
            "
          >
            <v-list-item-avatar>
              <v-icon class="grey--text">fa-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ map[path].label }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
        </template>

        <tab-link
          v-else-if="map[path].scenario === 'view'"
          :title="map[path].label"
          :to="'/' + alias + '/' + path + '/' + editedItem.id"
          :level="level + 1"
        >
          <v-list-item @click="localValue = false">
            <v-list-item-avatar>
              <v-icon class="info--text">fa fa-eye</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ map[path].label }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
        </tab-link>

        <tab-link
          v-else-if="map[path].scenario === 'update'"
          :title="map[path].label"
          color="success"
          :to="'/' + alias + '/' + path + '/' + editedItem.id"
          :level="level + 1"
        >
          <v-list-item @click="localValue = false">
            <v-list-item-avatar>
              <v-icon class="success--text">fa-pencil-alt</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Редактировать</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
        </tab-link>

        <template v-else-if="map[path].scenario === 'delete'">
          <v-list-item
            @click="
              $emit('item:delete', editedItem.id)
              localValue = false
            "
          >
            <v-list-item-avatar>
              <v-icon class="error--text">fa-trash-alt</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Удалить</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
        </template>

        <tab-link
          v-else
          :title="map[path].label"
          :to="'/' + alias + '/' + path + '/' + editedItem.id"
          :level="level + 1"
        >
          <v-list-item @click="localValue = false">
            <v-list-item-avatar>
              <v-icon class="grey--text">fa-list</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ map[path].label }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
        </tab-link>
      </template>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: 'row-actions-mob',

  data: () => ({}),

  props: {
    value: Boolean,
    rowActions: Array,
    editedItem: Object,
    rules: Object,
    level: Number,
    alias: String,
    map: Object
  },

  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss"></style>
