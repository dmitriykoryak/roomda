<template>
  <div>
    <v-btn
      v-if="mini"
      icon
      title="Добавить в избранное"
      :color="isFav ? 'pink' : 'info'"
      :title="isFav ? 'Удалить из избранного' : 'Добавить в избранное'"
      @click="toggleFavorite"
      ><v-icon>favorite</v-icon></v-btn
    >
    <v-btn
      v-else
      small
      text
      :style="{ width: '100%' }"
      :title="isFav ? 'Удалить из избранного' : 'Добавить в избранное'"
      class="grey"
      :class="$vuetify.theme.dark ? 'grey darken-3' : 'lighten-3'"
      @click="toggleFavorite"
    >
      <v-icon small left :color="isFav ? 'pink' : ''">favorite</v-icon>
      {{ isFav ? "В избранном" : "В избранное" }}
    </v-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  created() {
    this.favKey = this.isSale ? "sale" : "rent";
  },
  data() {
    return {
      favKey: null,
    };
  },
  props: {
    mini: Boolean,
    isSale: Boolean,
    realtyId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    toggleFavorite() {
      this.$store.commit(this.isFav ? "Favorites/delete" : "Favorites/add", {
        favKey: this.favKey,
        id: this.realtyId,
      });
    },
  },
  computed: {
    isFav() {
      const favIds = this.favItems[this.favKey];
      return favIds && favIds.includes(this.realtyId);
    },
    ...mapState({
      favItems: (state) => state.Favorites.items,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
