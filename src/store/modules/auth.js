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
      if ($router.currentRoute.value.name === "login") {
        $router.push({ name: "dashboard" });
      } else {
        $router.push({ name: "_dashboard" });
      }
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      localStorage.clear();
      location.reload();
      if ($router.currentRoute.value.name === "dashboard") {
        $router.push({ name: "login" });
      } else {
        $router.push({ name: "_login" });
      }
    },
  },
};
