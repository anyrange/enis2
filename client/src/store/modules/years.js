import { getYears } from "../../api";

const shorterYearName = (name) => {
  return name.substring(0, 9);
};

const defaultState = () => {
  return {
    data: [],
    actual: null,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_YEARS(state, result) {
      state.data = result;
    },
    SET_ACTUAL(state, payload) {
      state.actual = payload;
    },
    CLEAR_YEARS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getYearId: (state) => (label) => {
      return state.data.find((item) => item.label === label)?.value || "";
    },
  },
  actions: {
    fetchYears: async ({ commit, state }, { force }) => {
      if (!!state.data.length && !force) {
        return;
      }
      try {
        const years = await getYears();
        const actualYearIndex = years.findIndex((year) => year.isActual);
        const actualYear = years.find((year) => year.isActual);
        !state.actual && commit("SET_ACTUAL", shorterYearName(actualYear.Name));
        const formattedYears = years
          .slice(actualYearIndex, actualYearIndex + 3)
          .map(({ Id: value, Name: label, isActual }) => ({
            value,
            label: shorterYearName(label),
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
