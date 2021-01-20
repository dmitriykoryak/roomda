<template>
  <div class="action-btn action-btn-scoped">
    <div
      v-if="localActions.length === 1"
      @click="localActions[0].method && localActions[0].method()"
    >
      <component
        :is="comName"
        :to="localActions[0].url"
        :noRoute="!localActions[0].url"
        :title="localActions[0].title"
        :color="localActions[0].color"
        :level="level + 1"
        component="v-btn"
        :fixed="fixed"
        :absolute="absolute"
        :top="top"
        :bottom="bottom"
        :right="right"
        :left="left"
        fab
        dark
        :style="styleObj"
      >
        <v-icon>
          {{ localActions[0].icon }}
        </v-icon>
      </component>
    </div>

    <v-speed-dial
      v-else
      v-model="fab"
      :fixed="fixed"
      :absolute="absolute"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      fab
      dark
      direction="top"
      transition="slide-y-reverse-transition"
      :style="styleObj"
    >
      <template v-slot:activator>
        <v-btn color="blue darken-2" fab dark>
          <v-icon v-if="fab">fa-times</v-icon>
          <v-icon v-else>fa-ellipsis-h</v-icon>
        </v-btn>
      </template>

      <div
        v-for="action in localActions"
        @click="action.method && action.method()"
        :key="action.icon"
      >
        <component
          :is="action.url ? 'tab-link' : 'v-btn'"
          :title="action.title"
          :color="action.color"
          :to="action.url"
          :level="level + 1"
          component="v-btn"
          rounded
          dark
        >
          <span>{{ action.title }}</span>
          <v-icon right small>
            {{ action.icon }}
          </v-icon>
        </component>
      </div>
    </v-speed-dial>
  </div>
</template>

<script>
export default {
  name: 'action-btn',
  data: () => ({
    fab: false
  }),
  props: {
    title: String,
    level: Number,
    actions: [Function, Array],
    leftWindow: [Number, Boolean],
    bottom: Boolean,
    top: Boolean,
    left: Boolean,
    right: Boolean,
    fixed: Boolean,
    absolute: Boolean,
    styleObj: Object
  },
  methods: {},
  computed: {
    comName() {
      return this.localActions[0].url ? 'tab-link' : 'v-btn'
    },
    localActions() {
      return typeof this.actions === 'function' ? this.actions() : this.actions
    }
  }
}
</script>

<style lang="scss">
.action-btn {
  .left {
    .v-speed-dial__list {
      align-items: flex-start;
    }
  }
  .right {
    .v-speed-dial__list {
      align-items: flex-end;
    }
  }

  .v-speed-dial--fixed,
  .v-speed-dial--absolute {
    z-index: 6;
  }
}
</style>
