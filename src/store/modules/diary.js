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
    ADD_DIARY(state, { response, term }) {
      state.data.push({
        termName: term.Name,
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
    fetchDiary: async ({ commit, state }, term) => {
      if (state.data.find((item) => item.termName === term.Name)) return;
      commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", { response: await getDiary(term.Id), term });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
