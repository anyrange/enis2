import { getTerms } from "@/api";

const defaultState = () => {
  return {
    data: [],
    selected: "",
    loading: true,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
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
    CLEAR_TERMS(state) {
      Object.assign(state, defaultState());
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
