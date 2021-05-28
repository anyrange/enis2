import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
    city: null,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_CITY(state, payload) {
      state.city = payload;
    },
    REMOVE_USER: (state) => {
      state.user = null;
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.user;
    },
    getCity(state) {
      return state.city;
    },
    getCityValue(state) {
      return state.city.value;
    },
  },
  actions: {
    auth: ({ commit }, success) => {
      commit("SET_USER", success);
    },
    setCity: ({ commit }, city) => {
      commit("SET_CITY", city);
    },
    logout: ({ commit }) => {
      commit("REMOVE_USER", "");
    },
  },
  plugins: [createPersistedState()],
});
