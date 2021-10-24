import { getDiary } from "../../api";

const defaultState = () => {
  return {
    data: [],
    loading: false,
  };
};

function isExistsAtIndex(state, termName, yearName) {
  const index = state.data.findIndex(
    (item) => item.termName === termName && item.yearName === yearName
  );
  return index === -1 ? false : index;
}

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    ADD_DIARY(state, { diary, termName, yearName }) {
      const index = isExistsAtIndex(state, termName, yearName);
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
    fetchDiary: async ({ commit, state }, { termId, termName, yearName }) => {
      if (isExistsAtIndex(state, termName, yearName) !== false) return;
      commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", {
          diary: await getDiary(termId),
          termName,
          yearName,
        });
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
