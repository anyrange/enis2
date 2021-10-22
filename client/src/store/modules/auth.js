import { login } from "../../api";
import $router from "../../router";

export default {
  namespaced: true,
  state: {
    authenticated: false,
    savedAccount: null,
  },
  mutations: {
    SET_AUTH(state, value) {
      state.authenticated = value;
    },
    SET_ACCOUNT(state, account) {
      state.savedAccount = account;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    getCredentials(state) {
      return state.savedAccount;
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
    logout: ({ commit, dispatch }) => {
      commit("SET_AUTH", false);
      dispatch("preferences/clearCache", null, { root: true });
      $router.push({ name: "login" });
    },
  },
};
