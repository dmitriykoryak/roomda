<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      oldSearchItem: null,
    };
  },
  methods: {
    async filterMixinInit() {
      await this.$store.dispatch("fetchRealtyType");
      this.selectFirstType();
      await this.$store.dispatch("fetchRealtySubType");
      this.selectFirstSubType();
      this.oldSearchItem = { ...this.searchItem };
    },

    async changeRealtyType(realtyTypeId) {
      this.$store.commit("updateRealtyTypeId", realtyTypeId);
      await this.$store.dispatch("fetchRealtySubType", true);
      this.selectFirstSubType(true);
    },

    selectFirstType() {
      const firstId = Object.keys(this.realtyType)[0];
      if (!this.realtyTypeId) {
        this.$store.commit("updateRealtyTypeId", firstId);
      }
    },

    selectFirstSubType(forceUpdate = false) {
      const firstId = Object.keys(this.realtySubType)[0];
      if (forceUpdate || !this.searchItem.type_id) {
        this.$store.commit("updateSearchItem", {
          ...this.searchItem,
          type_id: this.realtyTypeId === "1" ? [] : firstId,
        });
      }
    },

    resetForm() {
      this.$store.commit("updateSearchItem", {});
    },

    updateSearchItem(attr, val) {
      this.$store.commit("updateSearchItem", {
        ...this.searchItem,
        [attr]: val,
      });
    },

    async fetchRealty(params = {}, reload = false, addQueryIfEmpty = false) {
      if (reload || !this._.isEqual(this.searchItem, this.oldSearchItem)) {
        this.$emit("fetch:realty", params);
        this.oldSearchItem = { ...this.searchItem };
      }
    },
  },

  computed: {
    realtyTypeItems() {
      let out = [];
      for (let [id, type] of Object.entries(this.realtyType)) {
        out.push({
          value: id,
          text: type.label,
        });
      }
      return out;
    },
    realtySubTypeItems() {
      let out = [];
      let index = 0;
      for (let [id, type] of Object.entries(this.realtySubType)) {
        out.push({
          value: id,
          text: type.label,
        });
        index++;
      }
      return out;
    },
    ...mapState([
      "realtyType",
      "searchItem",
      "realtyTypeId",
      "realtySubType",
      "sale",
      "rent",
    ]),
    ...mapGetters(["query"]),
  },
};
</script>
