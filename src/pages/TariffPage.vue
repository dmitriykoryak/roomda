<template>
  <v-container>
      <breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" />

    <div class="content" id="top">
        <heading1 class="mb-3">
            Тарифы для частных лиц, коды доступа
        </heading1>
      <p style="margin-top:10px;">
        Вы можете получить полный доступ к объявлениям любой категории или
        пакету категорий на сайте используя специальный код доступа? Код доступа — это уникальная последовательность из 8-ми символов
            служащая для получения полного доступа к контактным данным
            собственников, фотографиям, геопозиции объектов в объявлениях одной
            категории или пакета категорий аренды или продажи недвижимости.
            Каждый код доступа имеет период действия 7, 14 или 30 дней. Вы
            получаете код доступа после оплаты письмом на указанный email или
            смс-сообщением на номер телефона
        Стоимость кода доступа зависит от состава категорий и периода действия.
        Если у вас уже есть код доступа и вы хотите получить код к той же
        (продлить доступ) или другой категории, то вы можете использовать его
        для получения скидки от 5 до 40%.
      </p>

      <div id="tariff-prodazha" class="tariffblock contentblock" style="">
        <v-row>
              <v-col cols="12" sm="4">
                <h2 style="padding-bottom:5px;">7 дней, пакет продажи</h2>
                <p style="font-size:12px; margin:0 0 5px 0;">
                  Код доступа действует в течение 7 дней для всех категорий
                  продажи недвижимости<span id="showlist"
                    ></span
                  >
                </p>
                <div style="margin:12px 0 15px 0;">
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                </div>
                <v-btn :class="$vuetify.theme.dark ? ' lime darken-4' : 'yellow'" depressed @click="selectTariff(1)">Получить</v-btn>
              </v-col>
              <v-col cols="12" sm="4">
                <h2 style="padding-bottom:5px;">14 дней, пакет продажи</h2>
                <p style="font-size:12px; margin:0 0 5px 0;">
                  Код доступа действует в течение 14 дней для всех категорий
                  продажи недвижимости<span id="showlist"
                    ></span
                  >
                </p>
                <div style="margin:15px 0 15px 0;">
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                  <div class="day-gray"></div>
                  <div class="day-gray"></div>
                  <div class="clear"></div>
                </div>
                <v-btn :class="$vuetify.theme.dark ? ' lime darken-4' : 'yellow'" depressed @click="selectTariff(2)">Получить</v-btn>
              </v-col>
              <v-col cols="12" sm="4">
                <h2 style="padding-bottom:5px;">30 дней, пакет продажи</h2>
                <p style="font-size:12px; margin:0 0 5px 0;">
                  Код доступа действует в течение 30 дней для всех категорий
                  продажи недвижимости<span id="showlist"
                    ></span
                  >
                </p>
                <div style="margin:15px 0 15px 0;">
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                  <div class="day"></div>
                  <div class="day"></div>
                  <div class="clear"></div>
                </div>
                <v-btn :class="$vuetify.theme.dark ? ' lime darken-4' : 'yellow'" depressed @click="selectTariff(3)">Получить</v-btn>
              </v-col>
            </v-row>
       
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    created() {
        document.title = "Тарифы";
    },
    data() {
        return {
            breadcrumbs: [
                {
                text: "Главная",
                to: "/",
                },
                {
                text: "Тарифы",
                },
            ],
        }
    },
    methods: {
        selectTariff(id) {
            this.$store.commit('updateTariffId', id)
            this.$router.push({name: 'pay'})
        }
    },
    computed: mapGetters(["isMobileApp"]),
};
</script>

<style lang="scss" scoped>
.day, .day-gray {
width:17px;
height:17px;
border:0px solid #999;
background:#999999;
background: -moz-linear-gradient(0% 100% 90deg,#777777, #999999);
background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#999999), to(#777777)); 
margin:0 2px 2px 0;
float:left;
}
.day-gray {					
background:#eee;
background:#ddd;
background:#fff;
background:#e7e7e7;
border:1px solid #e7e7e7;
background:#fff;
border:1px solid #ddd;
background:#ececec;
border:0px solid #ececec;
}
.clear {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
