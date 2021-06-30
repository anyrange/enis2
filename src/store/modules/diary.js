import { getDiary } from "@/api";

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
    ADD_DIARY(state, { response, termId }) {
      state.data.push({
        termId: termId,
        data: response.data,
      });
    },
  },
  getters: {
    getDiary: (state) => {
      return state;
    },
  },
  actions: {
    fetchDiary: async ({ commit, state }, termId) => {
      if (state.data.find((item) => item.termId === termId)) return;
      commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", { response: await getDiary(termId), termId });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
