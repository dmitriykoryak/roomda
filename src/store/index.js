import Vue from "vue";
import Vuex from "vuex";
import Query from "~~/store/helpers/Query.js";
import Url from "~~/store/helpers/Url.js";
import Validator from "~~/store/helpers/Validator.js";
import Number from "~~/store/helpers/Number.js";
import Storage from "~~/store/helpers/Storage.js";
import Obj from "~~/store/helpers/Obj.js";
import Arr from "~~/store/helpers/Arr.js";
import Cordova from "~~/store/helpers/Cordova.js";
import Date from "~~/store/helpers/Date.js";
import DOM from "~~/store/helpers/DOM.js";
import SetState from "~~/store/modules/SetState.js";
import Favorites from "@/store/modules/Favorites.js";
import UserState from "~~/store/modules/UserState";
import Render from "~~/store/modules/Render";

import $router from "@/router.js";
import {
  getRealty,
  getRealtyType,
  getRealtySubType,
  getRealtyTotal,
  addRealty,
  getRealtyCountTypes,
} from "@/services/RealtyService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Query,
    Url,
    Validator,
    Number,
    Storage,
    Obj,
    Arr,
    SetState,
    Favorites,
    Cordova,
    Date,
    DOM,
    UserState,
    Render,
  },
  /**
   * Глобльное состояние приложения
   */
  state: {
    cityId: 13,
    sale: [],
    rent: [],
    total: {
      sale: 0,
      rent: 0,
    },
    /**
     * Типы недвижимости
     * @param {Object} realtyType
     */
    realtyType: {},
    realtyTypeId: null,
    realtySubType: {},
    realtyCountType: {
      sale: [],
      rent: [],
      commerce: [],
    },
    searchItem: {},
    flash: null,
    // ID выбранного тарифа
    tariffId: null,
    /**
     * Показывать ли сообщение об отсутствии результатов поиска
     * @param {Boolean}
     */
    noResMessage: false,
  },

  mutations: {
    updateCityId(store, cityId) {
      store.cityId = cityId;
    },
    saveRealty(store, { realty, isSale }) {
      store[isSale ? "sale" : "rent"] = realty;
    },
    unshiftRealty(store, { realty, isSale }) {
      store[isSale ? "sale" : "rent"].unshift(realty);
    },
    clearRealty(store, isSale) {
      store[isSale ? "sale" : "rent"] = [];
    },
    pushRealty(store, { realty, isSale }) {
      store[isSale ? "sale" : "rent"].push(realty);
    },
    saveTotal(store, { total, isSale }) {
      store.total[isSale ? "sale" : "rent"] = total;
    },
    saveRealtyType(store, realtyType) {
      store.realtyType = realtyType;
    },
    saveRealtySubType(store, realtySubType) {
      store.realtySubType = realtySubType;
    },
    saveRealtyCountType(store, { countType, key }) {
      store.realtyCountType[key] = countType;
    },
    updateRealtyTypeId(store, realtyTypeId) {
      store.realtyTypeId = realtyTypeId;
    },
    updateSearchItem(store, searchItem) {
      store.searchItem = searchItem;
    },
    clearSearchItem(store) {
      store.searchItem = {};
    },
    updateFlash(store, flash) {
      store.flash = flash;
    },
    updateTariffId(store, tariffId) {
      store.tariffId = tariffId;
    },
    updateNoResMessage(store, noResMessage) {
      store.noResMessage = noResMessage;
    },
  },

  actions: {
    /**
     * ЗАпросить список обьектов
     * @param {Boolean} fetchAgain - запросить еще раз список обьектов если прошлый запрос вернул пустой результат
     */
    async fetchRealty(
      { state, commit },
      { params, isSale, reload, fetchAgain = false }
    ) {
      const realtyList = isSale ? state.sale : state.rent;

      if (reload || realtyList.length === 0) {
        const defaultParams = {
          city_id: state.cityId,
          typeGroupId: state.realtyTypeId,
        };

        commit("clearRealty", isSale);
        let response;
        response = await getRealty(
          null,
          {
            ...params,
            ...defaultParams,
          },
          isSale,
          false
        );
        let realty = response.data.data;

        if (realty.length) {
          commit("updateNoResMessage", false);
        } else if (fetchAgain) {
          commit("updateNoResMessage", true);
          response = await getRealty(null, defaultParams, isSale, false);
          realty = response.data.data;
        }

        const total = response.data.dataAdd && response.data.dataAdd.count;
        if (total) {
          commit("saveTotal", { total, isSale });
        }
        commit("saveRealty", {
          realty,
          isSale,
        });
      }
    },

    async fetchRealtyTotal({ state, commit }, { params, isSale, reload }) {
      let total = isSale ? state.total.sale : state.total.rent;

      if (reload || !total) {
        params = {
          ...params,
          city_id: state.cityId,
          typeGroupId: state.realtyTypeId,
        };
        const response = await getRealtyTotal(params, isSale, false);
        commit("saveTotal", { total: response.data.data, isSale });
      }
    },

    async fetchRealtyType({ state, commit }, reload = false) {
      if (reload || Vue._.isEmpty(state.realtyType)) {
        const response = await getRealtyType(false);
        commit("saveRealtyType", response.data.data);
      }
    },

    async fetchRealtySubType({ state, commit }, reload = false) {
      if (reload || Vue._.isEmpty(state.realtySubType)) {
        const response = await getRealtySubType(state.realtyTypeId || 1, false);
        commit("saveRealtySubType", response.data.data);
      }
    },

    async fetchRealtyCountTypes({ state, commit }) {
      const params = { limit: 6, cityId: state.cityId };
      if (!state.realtyCountType.sale.length) {
        getRealtyCountTypes({ typeCategory: 1, ...params }, true).then(
          (response) => {
            commit("saveRealtyCountType", {
              countType: response.data.data,
              key: "sale",
            });
          }
        );
      }
      if (!state.realtyCountType.rent.length) {
        getRealtyCountTypes({ typeCategory: 1, ...params }, false, false).then(
          (response) => {
            commit("saveRealtyCountType", {
              countType: response.data.data,
              key: "rent",
            });
          }
        );
      }
      if (!state.realtyCountType.commerce.length) {
        getRealtyCountTypes({ typeCategory: 2, ...params }, true, false).then(
          (response) => {
            commit("saveRealtyCountType", {
              countType: response.data.data,
              key: "commerce",
            });
          }
        );
      }
    },

    async addRealty({ commit }, { realty, isSale, context }) {
      await addRealty(realty, isSale, context);
      return true;
    },

    async filtrateRealty(
      { commit, dispatch, state },
      { isSale, typeId, typeGroupId }
    ) {
      commit("clearRealty", isSale);
      if (typeGroupId !== state.realtyTypeId) {
        commit("updateRealtyTypeId", typeGroupId);
        await dispatch("fetchRealtySubType", true);
      }
      commit("updateSearchItem", {
        type_id: typeGroupId === "1" ? [typeId] : typeId,
      });

      if (
        ($router.currentRoute.name === "realtysaleList" && isSale) ||
        ($router.currentRoute.name === "realtyList" && !isSale) ||
        $router.currentRoute.name === "mapSale" ||
        $router.currentRoute.name === "mapRent"
      ) {
        return true;
      } else {
        $router.push({ name: isSale ? "realtysaleList" : "realtyList" });
        return false;
      }
    },

    async fetchCoords({ commit }, { realty, isSale, context }) {
      await getCoords(realty, isSale, context);
      return true;
    },
  },
});
