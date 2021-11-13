import { getYears } from "../../api";

const defaultState = () => {
  return {
    data: [],
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
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
    fetchYears: async ({ commit, state }, { force }) => {
      // if (state.data.length && !force) {
      //   return;
      // }
      try {
        const years = await getYears();
        const actualYearIndex = years.findIndex((year) => year.isActual);
        const formattedYears = years
          .slice(actualYearIndex, actualYearIndex + 3)
          .map(({ Id: value, Name: label, isActual }) => ({
            value,
            label: label.substring(0, 9),
            isActual,
          }))
          .reverse();
        commit("SET_YEARS", formattedYears);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
