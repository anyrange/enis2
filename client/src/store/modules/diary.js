import { getDiary } from "../../api";

function existsAtIndex(state, termName, yearName) {
  const index = state.data.findIndex(
    (item) => item.termName === termName && item.yearName === yearName
  );
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
    ADD_DIARY(state, { diary, termName, yearName }) {
      const index = existsAtIndex(state, termName, yearName);
      index === false
        ? (state.data = [...state.data, { diary, termName, yearName }])
        : (state.data[index].diary = diary);
    },
    CLEAR_DIARY(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getCurrentTermDiary:
      (state) =>
      ({ termName, yearName }) => {
        return (
          state.data.find(
            (item) => item.termName === termName && item.yearName === yearName
          )?.diary || []
        );
      },
  },
  actions: {
    fetchDiary: async ({ commit }, { termId, termName, yearName }) => {
      try {
        commit("ADD_DIARY", {
          diary: await getDiary(termId),
          termName,
          yearName,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
