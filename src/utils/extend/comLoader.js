/**
 * Глобальная регистрация компонентов
 */
import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

//Функция для регистрации компонентов по webpack-requireContext
let comReg = (requireContext) => {
  requireContext.keys().forEach(async (fileName) => {
    const componentConfig = requireContext(fileName);
    const componentName = upperFirst(
      camelCase(
        fileName
          .split("/")
          .pop()
          .replace(/\.\w+$/, "")
      )
    );

    Vue.component(componentName, componentConfig.default || componentConfig);
  });
};

// Регистрация компонентов из папки lib/src/components
let requireContext = require.context(
  "~~/components",
  true,
  /[A-Z]\w+\.(vue|js)$/
);
comReg(requireContext);

import ItemsList from "@/components/ItemsList.vue";
import ScrolledList from "@/components/ScrolledList.vue";
import RealtyList from "@/components/RealtyList.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import FavButton from "@/components/FavButton.vue";
import Heading1 from "@/components/Heading1.vue";
import FilterBtnMenu from "@/components/filter/FilterBtnMenu.vue";

Vue.component("ItemsList", ItemsList);
Vue.component("ScrolledList", ScrolledList);
Vue.component("RealtyList", RealtyList);
Vue.component("Breadcrumbs", Breadcrumbs);
Vue.component("FavButton", FavButton);
Vue.component("Heading1", Heading1);
Vue.component("FilterBtnMenu", FilterBtnMenu);
