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
      } catch (err) {
        commit("SET_USER", false);
        return Promise.reject(err);
      }
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER");
      commit("terms/CLEAR_TERMS");
      commit("diary/CLEAR_DIARY");
      commit("grades/CLEAR_GRADES");
      commit("subject/CLEAR_SUBJECT");
      $router.push({ name: "login" });
    },
  },
};
