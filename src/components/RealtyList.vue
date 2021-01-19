<template>
  <div class="realty-list">
    <v-skeleton-loader-many
      :loading="loading"
      class="mx-auto"
      type="list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line"
    >
      <div>
        <div
          v-if="!hideNoResults && noResMessage"
          class="my-6"
          :class="$vuetify.breakpoint.smAndUp ? 'title' : 'subtitle-1'"
        >
          <div class="red--text">Измените параметры поиска</div>
          <div class="grey--text subtitle-1">или</div>
          посмотрите объекты показанные ниже:
        </div>
        <div v-for="(realty, i) in realtyList" :key="i">
          <RealtyPreview :realty="realty" :isSale="isSale" />
          <v-divider
            :class="$vuetify.breakpoint.mdAndUp ? 'mt-1' : 'mb-2'"
            v-if="i !== realtyList.length - 1"
          ></v-divider>
        </div>
      </div>
    </v-skeleton-loader-many>

    <div
      v-if="count && realtyList.length < count"
      class="d-flex align-center justify-end mt-5 mb-3"
    >
      <v-pagination
        v-if="!hidePagination"
        :value="page"
        @input="
          $emit('update:page', $event);
          scrollTo();
        "
        :length="totalPages"
        :total-visible="5"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import RealtyPreview from "@/components/RealtyPreview.vue";
import * as easings from "vuetify/es5/services/goto/easing-patterns";
import { mapState } from "vuex";

export default {
  components: {
    RealtyPreview,
  },
  data() {
    return {
      scrollOptions: {
        duration: 400,
        offset: 0,
        easing: easings.easeOutCubic,
      },
    };
  },
  props: {
    realtyList: {
      type: Array,
      default: function() {
        return [];
      },
    },
    isSale: Boolean,
    page: Number,
    totalPages: Number,
    count: Number,
    loading: Boolean,
    hideNoResults: Boolean,
    hidePagination: Boolean,
  },
  methods: {
    scrollTo() {
      this.$nextTick(() => this.$vuetify.goTo(0, this.scrollOptions));
    },
  },

  computed: mapState(["noResMessage"]),
};
</script>

<style lang="scss" scoped></style>
