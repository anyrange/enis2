import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import api from "@/api";
import router from "@/router";

const getDefaultState = () => {
  return {
    user: null,
  };
};

export default createStore({
  state: getDefaultState(),
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.user;
    },
  },
  actions: {
    login: async ({ commit }, { credentials }) => {
      const response = await api.login(credentials);
      console.log(response);
      commit("SET_USER", response.success);
    },
    logout: ({ commit }) => {
      commit("RESET", "");
      router.push({ name: "login" });
    },
  },
  plugins: [createPersistedState()],
});
