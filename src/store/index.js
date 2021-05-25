import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

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
    auth: ({ commit }, success) => {
      commit("SET_USER", success);
    },
    logout: ({ commit }) => {
      commit("RESET", "");
    },
  },
  plugins: [createPersistedState()],
});
