<template>
  <div class="scrolled-list">
    <div class="d-flex align-center mb-3">
      <h2>{{ title }}</h2>
    </div>

    <v-slide-group show-arrows>
      <v-slide-item v-for="(item, i) in items" :key="i">
        <v-card
          :class="{ 'ml-4': i !== 0 }"
          flat
          outlined
          width="256"
          :to="{ name: 'realtysale', params: { id: item.id } }"
        >
          <v-img class="white--text align-end" height="153px" :src="item.img" />

          <v-subheader v-if="item.subheader">{{ item.subheader }}</v-subheader>

          <v-card-title class="pb-0 text-truncate">
            <a @click.prevent>
              <span class="subtitle-1">{{ item.title }}</span>
            </a>
          </v-card-title>

          <v-card-text
            v-if="item.boldtext"
            class="text--primary font-weight-bold"
          >
            {{ item.boldtext }}
          </v-card-text>
          <v-card-subtitle v-if="item.subtitle">{{
            item.subtitle
          }}</v-card-subtitle>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: 1,
    };
  },
  props: {
    title: String,
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  computed: {
    slideStep() {
      if (this.$vuetify.breakpoint.lgAndUp) {
        return 4;
      } else if (this.$vuetify.breakpoint.mdAndUp) {
        return 4;
      } else if (this.$vuetify.breakpoint.smAndUp) {
        return 3;
      } else {
        return 2;
      }
    },
  },
};
</script>
<style lang="scss">
.scrolled-list {
  .v-slide-group {
    .v-slide-group__prev {
      margin-left: -52px;
    }
    .v-slide-group__next {
      margin-right: -10px;
    }
  }
}
</style>
