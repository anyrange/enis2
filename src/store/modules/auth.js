import { login } from "@/api";
import $router from "@/router";

export default {
  namespaced: false,
  state: {
    user: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    REMOVE_USER: (state) => {
      state.user = false;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user;
    },
  },
  actions: {
    login: async ({ commit }, credentials) => {
      const response = await login(credentials);
      commit("SET_USER", response.success);
      $router.push({ name: "dashboard" });
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      $router.push({ name: "login" });
      localStorage.clear();
      location.reload();
    },
  },
};
