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
      try {
        await login(credentials);
        commit("SET_USER", true);
        $router.push({ name: "dashboard" });
      } catch {
        commit("SET_USER", false);
      }
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      $router.push({ name: "login" });
      localStorage.clear();
      location.reload();
    },
  },
};
