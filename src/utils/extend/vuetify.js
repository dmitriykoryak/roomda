import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import "vuetify/src/styles/main.sass";
import ru from "~~/utils/locale/ru";

/**
 * vuetify Options
 */
let vuetifyOptions = {
  lang: {
    locales: { ru },
    current: "ru",
  },
  iconfont: "fa",
  theme: {
    dark: false,
    themes: {
      light: {
        error: "#b71c1c",
      },
      dark: {
        error: "#FFB0B0",
      },
    },
  },
};

Vue.use(Vuetify);

export default new Vuetify(vuetifyOptions);
