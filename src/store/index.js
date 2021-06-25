import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { login as $login } from "@/api";
import $router from "@/router";

export default createStore({
  state: {
    user: null,
    city: null,
    theme: null,
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
      state.user = null;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user;
    },
    getCity(state) {
      return state.city;
    },
    getCityValue(state) {
      return state.city.value;
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
    setCity: ({ commit }, city) => {
      commit("SET_CITY", city);
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      if ($router.currentRoute.value.name === "dashboard") {
        $router.push({ name: "login" });
      } else {
        $router.push({ name: "_login" });
      }
    },
    initTheme({ commit, getters }) {
      const cachedTheme = getters.getTheme;
      const prefer = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (cachedTheme) {
        commit("SET_THEME", cachedTheme);
      } else if (prefer) {
        commit("SET_THEME", "dark");
      } else {
        commit("SET_THEME", "light");
      }
    },
    toggleTheme({ commit, getters }) {
      const theme = getters.getTheme;
      theme === "light"
        ? commit("SET_THEME", "dark")
        : commit("SET_THEME", "light");
    },
  },
  plugins: [createPersistedState()],
});
