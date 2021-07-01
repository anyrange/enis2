import { getGrades } from "@/api";

const defaultState = () => {
  return {
    data: [],
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
    SET_GRADES(state, result) {
      state.data = result;
    },
    CLEAR_STATE(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getGrades: (state) => {
      return state;
    },
  },
  actions: {
    fetchGrades: async ({ commit, state }) => {
      if (!state.data) commit("SET_LOADING", true);
      try {
        commit("SET_GRADES", await getGrades());
      } finally {
        commit("SET_LOADING", false);
      }
    },
    clearGrades: ({ commit }) => {
      commit("CLEAR_STATE");
    },
  },
};
