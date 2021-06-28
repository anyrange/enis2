import { getGrades } from "@/api";

export default {
  namespaced: true,
  state: {
    data: [],
    loading: true,
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_GRADES(state, result) {
      state.data = result;
    },
  },
  getters: {
    getGrades: (state) => {
      return state;
    },
  },
  actions: {
    fetchGrades: async ({ commit, state }) => {
      if (state.data.length) return;
      commit("SET_LOADING", true);
      try {
        commit("SET_GRADES", await getGrades());
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
