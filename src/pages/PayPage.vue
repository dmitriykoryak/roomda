<template>
  <v-container :style="{ maxWidth: '1070px' }">
    <v-alert colored-border type="info" class="info--text" outlined>
      Открытые варианты закончились. Оплатите подписку
    </v-alert>

    <v-btn-toggle v-model="userType">
      <v-btn>
        <v-icon left>mdi-account-outline</v-icon>
        <span>Частное лицо</span>
      </v-btn>

      <v-btn>
        <v-icon left>mdi-account-multiple-outline</v-icon>
        <span>Агентство</span>
      </v-btn>
    </v-btn-toggle>

    <v-divider class="mt-4 mb-2"></v-divider>

    <v-row>
      <v-col
        v-for="(tariff, index) in curTariffs"
        :key="index"
        cols="12"
        md="4"
      >
        <v-card
          @click="$store.commit('updateTariffId', tariff.id)"
          :class="{
            'grey lighten-1': !$vuetify.theme.dark && tariff.id === tariffId,
            'grey darken-2': $vuetify.theme.dark && tariff.id === tariffId,
          }"
          v-blur
        >
          <v-card-text>
            <div>Тариф</div>
            <p
              class="display-1 black--text"
              :class="{ 'white--text': $vuetify.theme.dark }"
            >
              {{ tariff.period }} дней
            </p>
            <div class="display-1 red--text">
              <v-slide-y-reverse-transition mode="out-in">
                <div v-if="userType === 0" :key="1">
                  {{ tariff.cost | currency }}
                </div>
                <div v-else :key="2">
                  {{ tariff.cost | currency }}
                </div>
              </v-slide-y-reverse-transition>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              :color="tariff.id === tariffId ? 'white' : 'yellow darken-4'"
              :to="{ name: 'tariff' }"
            >
              Узнать больше
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4">
        <v-btn
          :color="$vuetify.theme.dark ? 'green darken-4' : 'success'"
          class="float-right"
          depressed
          :disabled="!tariffId"
          @click="fetchPayUrl"
          >Оплатить</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  created() {
    document.title = "Оплата";
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push({ name: "login" });
    }
  },
  data() {
    return {
      userType: 0,
      tariffs: [
        {
          id: 1,
          period: 7,
          cost: 290,
        },
        {
          id: 2,
          period: 14,
          cost: 490,
        },
        {
          id: 3,
          period: 30,
          cost: 790,
        },
        {
          id: 4,
          period: 7,
          cost: 580,
        },
        {
          id: 5,
          period: 14,
          cost: 980,
        },
        {
          id: 6,
          period: 30,
          cost: 1580,
        },
      ],
    };
  },
  methods: {
    async fetchPayUrl() {
      const response = await this.query.post(
        this.$config.api.url.realty + "/pay/default/start",
        {
          city_id: this.cityId,
          tariff_id: this.tariffs.find((t) => t.id === this.tariffId).id,
        }
      );
      if (response.data.data.url) {
        window.location.href = response.data.data.url;
      }
    },
  },
  computed: {
    curTariffs() {
      return this.userType === 0
        ? this.tariffs.slice(0, 3)
        : this.tariffs.slice(3, 6);
    },
    ...mapState(["tariffId", "cityId"]),
    ...mapGetters(["loggedIn", "query"]),
  },
};
</script>

<style lang="scss" scoped></style>
