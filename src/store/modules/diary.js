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
    SET_DIARY(state, result) {
      state.data = result;
    },
  },
  getters: {
    getDiary: (state) => {
      return state.data;
    },
    getLoading: (state) => {
      return state.loading;
    },
  },
  actions: {
    fetchDiary: async ({ commit }) => {
      commit("SET_LOADING", true);
      try {
        commit("SET_DIARY", await api.diary());
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
