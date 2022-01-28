import { getGrades } from "@/api";
import { existsAtIndex } from "@/utils";

const defaultState = () => {
  return {
    data: [],
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    ADD_GRADES(state, { grades, yearName }) {
      const index = existsAtIndex(state.data, { yearName });
      index === null
        ? (state.data = [...state.data, { grades, yearName }])
        : (state.data[index].grades = grades);
    },
    CLEAR_GRADES(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getCurrentGrades:
      (state) =>
      ({ yearName }) => {
        return (
          state.data.find((item) => item.yearName === yearName)?.grades || []
        );
      },
  },
  actions: {
    fetchGrades: async (
      { commit, state, rootState },
      { yearId, yearName, force }
    ) => {
      if (rootState.years.actual) {
        const exists = existsAtIndex(state.data, { yearName }) !== null;
        const isActualYear = rootState.years.actual === yearName;
        if (exists && !isActualYear && !force) {
          return;
        }
      }
      try {
        commit("ADD_GRADES", {
          grades: await getGrades(yearId),
          yearName,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
