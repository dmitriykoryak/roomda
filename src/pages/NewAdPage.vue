<template>
  <v-container class="new-add">
    <Heading2>Новое объявление</Heading2>
    <div class="d-flex justify-center flex-wrap">
      <HoverCard
        :item="{
          label: 'Продать',
          icon: 'mdi-key-variant',
        }"
        :isSelected="isSale === true"
        @click:card="isSale = true"
      >
      </HoverCard>
      <HoverCard
        :item="{
          label: 'Сдать длительно',
          icon: 'mdi-tag-text-outline',
        }"
        :isSelected="isSale === false"
        @click:card="isSale = false"
      >
      </HoverCard>
    </div>

    <v-slide-y-reverse-transition mode="out-in">
      <div v-if="isSale !== undefined" :key="isSale">
        <Heading2>Заполните поля</Heading2>
        <da-fields
          :editedItem.sync="editedItem"
          :labels="labels"
          :rules="rules"
          :struc="struc"
          :coms="coms"
          scenario="create"
          :mapKey="mapKey"
          :apiUrl="$config.api.url.realty"
          hideTabs
          :hiddenFields="['street_prefix']"
        ></da-fields>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn
                :loading="loading"
                @click="addRealty"
                class="float-right"
                :class="$vuetify.theme.dark ? 'green darken-4' : 'success'"
                text
                >Далее</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-slide-y-reverse-transition>
  </v-container>
</template>

<script>
import HoverCard from "@/components/HoverCard.vue";
import Heading2 from "@/components/Heading2.vue";
import SetMixin from "~~/mixins/SetMixin.vue";

export default {
  mixins: [SetMixin],
  inject: ["$validator"],
  components: {
    HoverCard,
    Heading2,
  },
  props: {
    cityId: Number,
  },
  created() {
    document.title = "Добавить новое объявление";
  },
  data() {
    return {
      AdTypes: [
        {
          label: "Продать",
          icon: "mdi-key-variant",
        },
        {
          label: "Сдать длительно",
          icon: "mdi-tag-text-outline",
        },
      ],
      isSale: undefined,
      editedItem: {},
      loading: false,
    };
  },
  methods: {
    async addRealty() {
      this.loading = true;
      if (!(await this.$validator.validateAll())) return;
      const success = await this.$store.dispatch("addRealty", {
        realty: this.editedItem,
        isSale: this.isSale,
        context: this,
      });
      this.loading = false;
      if (success) {
        this.$router.push({ name: "successAdd" });
      }
    },
  },
  computed: {
    mapKey() {
      return this.adType === "sale" ? "sale/default" : "rent/default";
    },
  },
};
</script>

<style lang="scss" scoped>
.new-add {
  max-width: 1024px;

  .map-wrap {
    margin-top: -30px;
    height: 400px;
  }
}
</style>
