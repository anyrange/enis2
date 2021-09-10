import { login } from "../../api";
import $router from "../../router";

export default {
  namespaced: true,
  state: {
    authenticated: false,
  },
  mutations: {
    SET_AUTH(state, value) {
      state.authenticated = value;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
  },
  actions: {
    login: async ({ commit }, credentials) => {
      try {
        await login(credentials);
        commit("SET_AUTH", true);
        $router.push({ name: "dashboard" });
      } catch (err) {
        commit("SET_AUTH", false);
        return Promise.reject(err);
      }
    },
    logout: ({ commit }) => {
      commit("SET_AUTH", false);
      commit("years/CLEAR_YEARS", null, { root: true });
      commit("terms/CLEAR_TERMS", null, { root: true });
      commit("diary/CLEAR_DIARY", null, { root: true });
      commit("grades/CLEAR_GRADES", null, { root: true });
      commit("subject/CLEAR_SUBJECT", null, { root: true });
      commit("preferences/CLEAR_PREFERENCES", null, { root: true });
      $router.push({ name: "login" });
    },
  },
};
