<template>
  <div
    class="grid-row-actions"
    :style="{
      position: 'fixed',
      top: fab.pos.y + 'px',
      left: fab.pos.x + 'px'
    }"
  >
    <v-speed-dial
      fab
      dark
      absolute
      :value="value"
      :direction="fab.direction"
      transition="slide-y-transition"
    >
      <div v-for="path in rowActions">
        <template v-if="map[path]">
          <v-btn
            v-if="map[path].type && map[path].type === 'link-ajax'"
            @click="$emit('notification:send')"
            color="grey"
            rounded
            dark
          >
            <span>{{ map[path].label }}</span>
            <v-icon right small>
              fa-circle
            </v-icon>
          </v-btn>

          <tab-link
            v-else-if="map[path].scenario === 'view'"
            :to="'/' + alias + '/' + path + '/' + itemId"
            :title="map[path].label"
            :level="level + 1"
            color="info"
            rounded
            dark
            small
            component="v-btn"
            :scenario="scenario"
          >
            <span>{{ map[path].label }}</span>
            <v-icon right small>
              fa fa-eye
            </v-icon>
          </tab-link>

          <tab-link
            v-else-if="map[path].scenario === 'update'"
            :to="'/' + alias + '/' + path + '/' + itemId"
            :title="map[path].label"
            :level="level + 1"
            color="success"
            rounded
            dark
            small
            component="v-btn"
            :scenario="scenario"
          >
            <span>{{ map[path].label }}</span>
            <v-icon right small>
              fa-pencil-alt
            </v-icon>
          </tab-link>

          <v-btn
            v-else-if="map[path].scenario === 'delete'"
            @click="$emit('item:delete')"
            rounded
            dark
            small
            color="red"
          >
            <span>{{ map[path].label }}</span>
            <v-icon right small>
              fa-trash-alt
            </v-icon>
          </v-btn>

          <tab-link
            v-else
            :title="map[path].label"
            :to="'/' + alias + '/' + path + '/' + itemId"
            :level="level + 1"
            rounded
            dark
            small
            color="blue-grey"
            component="v-btn"
            :scenario="scenario"
          >
            <span>{{ map[path].label }}</span>
            <v-icon right small>
              fa-list
            </v-icon>
          </tab-link>
        </template>
      </div>
    </v-speed-dial>
  </div>
</template>

<script>
export default {
  name: 'row-actions',

  created() {
    //Клик на document закрыть действия меню дейтсвий в строке грида
    document.addEventListener('click', () => this.updateValue(false))
    document.addEventListener('scroll', () => this.updateValue(false))
  },

  data: () => ({
    fab: {
      direction: 'top',
      pos: {
        x: 0,
        y: 0
      }
    },
    itemOldId: null
  }),

  props: {
    value: Boolean,
    trigger: Boolean,
    itemId: [Number, Boolean],
    event: MouseEvent,
    map: Object,
    level: Number,
    alias: String,
    scenario: String,
    mapKey: String,
    rowActions: Array
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
    /**
     * Toggle fab
     * */
    fabItemToggle() {
      const openFab = () => {
        this.fabCalcDirection()
        this.fabCalcPosition()
        this.updateValue(true)
      }

      if (!this.value) {
        openFab()
      } else {
        if (this.itemOldId === this.itemId) {
          this.updateValue(false)
        } else if (this.itemId) {
          this.updateValue(false)
          setTimeout(() => {
            openFab()
          }, 200)
        }
      }

      this.itemOldId = this.itemId
    },

    /**
     * Расчитать позицию fab
     * */
    fabCalcPosition() {
      if (!this.event) return

      this.fab.pos.x = this.event.clientX + 25
      this.fab.pos.y = this.event.clientY
    },

    /**
     * Расчитать направление открытия fab
     * */
    fabCalcDirection() {
      if (!this.event) return

      const limitSize = 400
      this.fab.direction = this.event.clientY < limitSize ? 'bottom' : 'top'
    }
  },

  watch: {
    trigger() {
      this.fabItemToggle()
    }
  }
}
</script>

<style lang="scss">
.grid-row-actions {
  z-index: 6;
  .v-speed-dial__list {
    align-items: flex-end;
  }
}
</style>
