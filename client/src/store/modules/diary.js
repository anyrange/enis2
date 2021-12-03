import { getDiary } from "../../api";

const existsAtIndex = (state, termName, yearName) => {
  const index = state.data.findIndex(
    (item) => item.termName === termName && item.yearName === yearName
  );
  return index === -1 ? null : index;
};

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
      index === null
        ? (state.data = [...state.data, { diary, termName, yearName }])
        : (state.data[index].diary = diary);
    },
    CLEAR_DIARY(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getCurrentDiary:
      (state, _, rootState) =>
      ({ termName, yearName }) => {
        const diary =
          state.data.find(
            (item) => item.termName === termName && item.yearName === yearName
          )?.diary || [];
        const sortedDiary =
          rootState.preferences.sortBy === "score"
            ? diary.sort((a, b) => b.Score - a.Score)
            : diary.sort((a, b) => a.Name.localeCompare(b.Name));
        return rootState.preferences.hideEmpty
          ? sortedDiary.filter((o) => o.Score !== 0)
          : sortedDiary;
      },
  },
  actions: {
    fetchDiary: async (
      { commit, rootState, state },
      { termId, termName, yearName, force = false }
    ) => {
      if (rootState.years.actual && rootState.terms.actual) {
        const exists = existsAtIndex(state, termName, yearName) !== null;
        const isActualTerm = rootState.terms.actual === termName;
        const isActualYear = rootState.years.actual === yearName;
        if (exists && !(isActualTerm && isActualYear) && !force) {
          return;
        }
      }
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
