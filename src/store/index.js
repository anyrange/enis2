import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { login as $login } from "@/api";
import $router from "@/router";

export default createStore({
  state: {
    user: false,
    city: {
      value: "sms.pvl.nis.edu.kz",
      label: "Павлодар ХБН",
    },
    theme: "",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_CITY(state, city) {
      state.city = city;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    REMOVE_USER: (state) => {
      state.user = false;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user;
    },
    getCity(state) {
      return state.city;
    },
    getTheme: (state) => {
      return state.theme;
    },
  },
  actions: {
    login: async ({ commit }, cred) => {
      const user = await $login(cred);
      commit("SET_USER", user.success);
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      if ($router.currentRoute.value.name === "dashboard") {
        $router.push({ name: "login" });
      } else {
        $router.push({ name: "_login" });
      }
    },
    setCity: ({ commit }, city) => {
      commit("SET_CITY", city);
    },
    setTheme({ commit, getters }) {
      const cachedTheme = getters.getTheme;
      const preferedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches;
      if (cachedTheme) {
        commit("SET_THEME", cachedTheme);
      } else if (preferedTheme) {
        commit("SET_THEME", "dark");
      } else {
        commit("SET_THEME", "light");
      }
    },
    toggleTheme({ commit, getters }) {
      const currentTheme = getters.getTheme;
      currentTheme === "light"
        ? commit("SET_THEME", "dark")
        : commit("SET_THEME", "light");
    },
  },
  plugins: [createPersistedState()],
});
