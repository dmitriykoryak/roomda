<template>
  <div>
    <MainForm :isSale.sync="isSale" />

    <v-container>
      <v-row>
        <v-col :col="12" :md="8">
          <items-list
            :items="saleItems"
            title="Купить квартиру"
            :md="4"
            :class="$vuetify.breakpoint.smAndDown ? '' : 'mt-8'"
          ></items-list>

          <scrolled-list title="Новые" :items="scrollListItems" class="mt-4" />

          <v-divider class="mt-5"></v-divider>

          <v-row :class="$vuetify.breakpoint.smAndDown ? '' : 'mt-3'">
            <v-col :cols="12" :md="6">
              <v-img
                src="https://yastatic.net/s3/vertis-frontend/realty-frontend-desktop/_/00de1d4209538fc87001f7df052d6166.jpg"
                :height="154"
                class="d-none d-md-flex"
              />
              <items-list
                class="mt-3"
                title="Снять квартиру"
                :items="rentItems"
              ></items-list>
            </v-col>

            <v-col :cols="12" :md="6">
              <v-img
                src="https://yastatic.net/s3/vertis-frontend/realty-frontend-desktop/_/2a31cc859f058c7858aedd1f87e7194a.jpg"
                :height="154"
                class="d-none d-md-flex"
              />
              <items-list
                class="mt-3"
                title="Коммерческая недвижимость"
                :items="commerceItems"
              ></items-list>
            </v-col>
          </v-row>
        </v-col>
        <v-col :col="12" :md="4" class="text-justify d-none d-md-block">
          <h3 class="mb-4">Почему доступ является платным?</h3>
          <p>
            Каждое объявление перед публикацией на сайте проходит специальную
            проверку, включающую этапы фильтрации и многофакторного анализа,
            результатом выполнения которых представляется наиболее достоверный
            вывод о том, является ли автор объявления собственником или
            посредником.
          </p>
          <p>
            Наша база недвижимости ежедневно формируется из объявлений
            собственников, таким образом, Вам не придется платить агентское
            вознаграждение. Такой уровень качества информации обеспечивается
            командой системы недвижимости "Roomda" и требует постоянной работы,
            поэтому доступ к информации предоставляется на платной основе.
          </p>
          <ul>
            <li>
              <router-link :to="{ name: 'tariff' }"
                >Тарифы и коды доступа</router-link
              >
            </li>
            <li>
              <router-link :to="{ name: 'tariff' }"
                >Инструкция по оплате</router-link
              >
            </li>
          </ul>

          <hr class="my-7 grey lighten-5" />

          <h3 class="mb-4">Агентствам недвижимости</h3>
          <p>
            Если Вы представляете агентство недвижимости, то Вы можете
            использовать специальные тарифы на подключение к базе прямых
            предложений от собственников по продаже и аренде недвижимости,
            которые Вы можете использовать в работе со своими клиентами,
            предлагая им больший выбор вариантов недвижимости.
          </p>
          <p>
            После регистрации Вы получите демо-доступ в личный кабинет -
            профессиональный инструмент для работы риэлтора.
          </p>
          <ul>
            <li>
              <router-link :to="{ name: 'tariff' }"
                >Тарифы для агентства</router-link
              >
            </li>
            <li>
              <router-link :to="{ name: 'tariff' }"
                >Регистрация агентства</router-link
              >
            </li>
          </ul>

          <hr class="my-7 grey lighten-5" />

          <h3 class="mb-4">Информация</h3>
          <ul>
            <li>
              <router-link :to="{ name: 'about' }"
                >О проекте "Roomda"</router-link
              >
            </li>
            <li>
              <router-link :to="{ name: 'about' }">Способы оплаты</router-link>
            </li>
            <!-- <li>
              <router-link :to="{ name: 'contacts' }"
                >Контактная Информация</router-link
              >
            </li> -->
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MainForm from "@/components/filter/MainForm.vue";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    MainForm,
  },
  created() {
    document.title =
      "Roomda. Недвижимость в Краснодаре и Краснодарской области.";
    this.$store.dispatch("fetchRealtyCountTypes");
    this.$store.dispatch("fetchRealty", { isSale: this.isSale });
  },
  data() {
    return {
      isSale: true,
      mapKey: "sale/default",
      articles: [
        {
          title: 'Микрорайон "Губернский"',
          img:
            "https://avatars.mds.yandex.net/get-yablogs/61002/file_1570179543529/touch900",
          subheader: "Аренда",
        },
        {
          title: 'Микрорайон "Губернский"',
          img:
            "https://avatars.mds.yandex.net/get-yablogs/51163/file_1586422729749/touch900",
          subheader: "Аренда",
        },
        {
          title: 'Микрорайон "Губернский"',
          img:
            "https://avatars.mds.yandex.net/get-yablogs/51778/file_1570709100597/touch900",
          subheader: "Аренда",
        },
      ],
    };
  },

  computed: {
    saleItems() {
      return this.realtyCountType.sale.map((item) => {
        const clickFunc = () =>
          this.$store.dispatch("filtrateRealty", {
            isSale: true,
            typeId: item.type_id.toString(),
            typeGroupId: item.typeGroupId.toString(),
          });
        return {
          label: this.getListLabel(this.mapKey, "type_id", item.type_id),
          clickFunc: clickFunc,
          num: item.count,
        };
      });
    },
    rentItems() {
      return this.realtyCountType.rent.map((item) => {
        const clickFunc = () =>
          this.$store.dispatch("filtrateRealty", {
            isSale: false,
            typeId: item.type_id.toString(),
            typeGroupId: item.typeGroupId.toString(),
          });
        return {
          label: this.getListLabel(this.mapKey, "type_id", item.type_id),
          clickFunc: clickFunc,
          num: item.count,
        };
      });
    },
    commerceItems() {
      return this.realtyCountType.commerce.map((item) => {
        const clickFunc = () =>
          this.$store.dispatch("filtrateRealty", {
            isSale: true,
            typeId: item.type_id.toString(),
            typeGroupId: item.typeGroupId.toString(),
          });
        return {
          label: this.getListLabel(this.mapKey, "type_id", item.type_id),
          clickFunc: clickFunc,
          num: item.count,
        };
      });
    },
    scrollListItems() {
      let realtyList = this.isSale ? this.sale : this.rent;
      let out = [];
      realtyList.forEach((realty) => {
        const item = {
          img: realty.images[0] && realty.images[0].url,
          title: this.getListLabel(this.mapKey, "type_id", realty.type_id),
          boldtext: this.$options.filters.currency(realty.cost),
          id: realty.id,
        };
        out.push(item);
      });
      return out;
    },
    ...mapState(["realtyCountType", "sale", "rent"]),
    ...mapGetters(["getListLabel"]),
  },
};
</script>

<style lang="scss" scoped></style>
