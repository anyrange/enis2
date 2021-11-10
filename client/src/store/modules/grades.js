import { getGrades } from "../../api";

function existsAtIndex(state, yearName) {
  const index = state.data.findIndex((item) => item.yearName === yearName);
  return index === -1 ? false : index;
}

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
      const index = existsAtIndex(state, yearName);
      index === false
        ? (state.data = [...state.data, { grades, yearName }])
        : (state.data[index].grades = grades);
    },
    CLEAR_GRADES(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getCurrentTermGrades:
      (state) =>
      ({ yearName }) => {
        return (
          state.data.find((item) => item.yearName === yearName)?.grades || []
        );
      },
  },
  actions: {
    fetchGrades: async ({ commit }, { yearId, yearName }) => {
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
