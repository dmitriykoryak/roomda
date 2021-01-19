/**
 * Импорт
 */
import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store/index";
import "~~/utils/filters/format";
import "~~/utils/extend/validators";
import vuetify from "@/utils/extend/vuetify";
import "~~/utils/extend/plugins";
import "~~/utils/extend/directives";
import "@/utils/extend/comLoader";
import "./registerServiceWorker";

import VueTelInputVuetify from "vue-tel-input-vuetify/lib";
Vue.use(VueTelInputVuetify, {
  vuetify,
});

/**
 * Запуск приложения и монтирование в DOM
 */
window.vue = new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
