import { getSubject } from "@/api";

const defaultState = () => {
  return {
    SAU: [],
    SAT: [],
    isEmpty: true,
    loading: true,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_SAU(state, result) {
      state.SAU = result;
    },
    SET_SAT(state, result) {
      state.SAT = result;
    },
    SET_IS_EMPTY(state, value) {
      state.isEmpty = value;
    },
    CLEAR_SUBJECT(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getSubject: (state) => {
      return state;
    },
  },
  actions: {
    fetchSubject: async ({ commit, dispatch }, subject) => {
      commit("SET_LOADING", true);
      try {
        commit(
          "SET_SAU",
          await getSubject(subject.JournalId, subject.Evaluations[0])
        );
        commit(
          "SET_SAT",
          await getSubject(subject.JournalId, subject.Evaluations[1])
        );
        dispatch("checkSubject");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    checkSubject: ({ commit, state }) => {
      if (!state.SAU || !state.SAT) {
        commit("SET_IS_EMPTY", true);
      } else {
        commit("SET_IS_EMPTY", false);
      }
    },
  },
};
