import { login } from "@/api";
import $router from "@/router";

export default {
  namespaced: true,
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
      commit("terms/CLEAR_TERMS", null, { root: true });
      commit("diary/CLEAR_DIARY", null, { root: true });
      commit("grades/CLEAR_GRADES", null, { root: true });
      commit("subject/CLEAR_SUBJECT", null, { root: true });
      commit("preferences/CLEAR_TAB", null, { root: true });
      $router.push({ name: "login" });
    },
  },
};
