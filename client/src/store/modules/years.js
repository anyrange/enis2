import { getYears } from "../../api";

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
    CLEAR_YEARS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    actualYearName: (state) => {
      return state.data.find((year) => year.isActual).label;
    },
    getYearIdByName: (state) => (label) => {
      return state.data.find((item) => item.label === label)?.value || "";
    },
  },
  actions: {
    fetchYears: async ({ commit }) => {
      commit("SET_LOADING", true);
      try {
        const years = await getYears();
        const actualYearIndex = years.findIndex((year) => year.isActual);
        const formattedYears = years
          .slice(actualYearIndex, actualYearIndex + 3)
          .map(({ Id: value, Name: label, isActual }) => ({
            value,
            label: label.substring(0, 9),
            isActual,
          }));
        commit("SET_YEARS", formattedYears.reverse());
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
