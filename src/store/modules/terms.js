import * as api from "@/api";

export default {
  namespaced: true,
  state: {
    data: {},
    loading: true,
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_TERMS(state, result) {
      state.data = result;
    },
  },
  getters: {
    getTerms: (state) => {
      return state.data;
    },
    getLoading: (state) => {
      return state.loading;
    },
  },
  actions: {
    fetchTerms: async ({ commit }) => {
      commit("SET_LOADING", true);
      try {
        commit("SET_TERMS", await api.terms());
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
