import { getTermsByYear } from "@/api";

const defaultState = () => {
  return {
    data: [],
    loading: false,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_TERMS(state, result) {
      state.data = result;
    },
    CLEAR_TERMS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    lastTermId: (state) => {
      return state.data[state.data.length - 1].Id;
    },
    currentTermId: (state) => {
      return state.data.find((term) => term.isActual).Id;
    },
  },
  actions: {
    fetchTermsByYear: async ({ commit, state }, id) => {
      !state.data.length && commit("SET_LOADING", true);
      try {
        commit("SET_TERMS", await getTermsByYear(id));
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
