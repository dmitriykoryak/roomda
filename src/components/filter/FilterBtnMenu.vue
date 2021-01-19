<template>
  <div>
    <v-sheet class="d-flex align-center" tile>
      <v-btn
        class="w-50 left-btn"
        :class="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-2'"
        text
        tile
        @click="dialog = true"
        ><v-icon left color="red">mdi-magnify</v-icon>Параметры</v-btn
      >
      <slot>
        <v-btn
          class="w-50"
          :class="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-2'"
          text
          tile
          :to="{ name: isSale ? 'mapSale' : 'mapRent' }"
          ><v-icon left color="red">place</v-icon>
          Карта
        </v-btn>
      </slot>
    </v-sheet>

    <!--Модальное окно-->
    <da-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :maxWidth="$vuetify.breakpoint.smAndDown ? '100%' : '1000'"
      randImg
      leftArrow
      title="Параметры"
    >
      <v-card class="fill-height">
        <v-card-text
          :class="{
            'px-0': $vuetify.breakpoint.smAndDown,
            'py-3': $vuetify.breakpoint.smAndDown,
            'py-8': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <FilterForm
            :loading="loading"
            :count="count"
            :isSale="isSale"
            :hideMapBtn="hideMapBtn"
            :saleRoute="saleRoute"
            :rentRoute="rentRoute"
            @click:show-btn="dialog = false"
            @fetch:realty="$emit('fetch:realty', $event)"
            flat
          />
        </v-card-text>
      </v-card>
    </da-dialog>
    <!--Модальное окно конец-->
  </div>
</template>

<script>
import FilterForm from "@/components/filter/FilterForm.vue";
export default {
  components: {
    FilterForm,
  },
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    loading: Boolean,
    count: Number,
    isSale: Boolean,
    hideMapBtn: Boolean,
    saleRoute: Object,
    rentRoute: Object,
  },
};
</script>

<style lang="scss" scoped>
.v-application .grey.lighten-2.left-btn {
  border-right: 1px solid white !important;
}
</style>
