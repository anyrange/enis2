import { getYears } from "@/api";

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
    SET_YEARS(state, result) {
      state.data = result;
    },
    SET_CURRENT_YEAR(state, res) {
      state.currentYear = res;
    },
    CLEAR_YEARS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getYears: (state) => {
      return state;
    },
    currentYearId: (state) => {
      return state.data.find((year) => year.isActual).Id;
    },
  },
  actions: {
    fetchYears: async ({ commit, state }) => {
      if (!state.data.length) commit("SET_LOADING", true);
      try {
        commit("SET_YEARS", await getYears());
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
