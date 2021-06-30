import { getTerms } from "@/api";

export default {
  namespaced: true,
  state: {
    data: [],
    selected: "",
    loading: true,
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_SELECTED(state, term) {
      state.selected = term;
    },
    SET_TERMS(state, result) {
      state.data = result;
    },
  },
  getters: {
    getTerms: (state) => {
      return state;
    },
  },
  actions: {
    setCurrentTerm: async ({ commit }, state) => {
      commit("SET_SELECTED", state);
    },
    fetchTerms: async ({ commit, state }) => {
      if (state.data.length) return;
      commit("SET_LOADING", true);
      try {
        commit("SET_TERMS", await getTerms());
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
