import { getSubject } from "@/api";

const defaultState = () => {
  return {
    data: {
      SAU: [],
      SAT: [],
      current: {},
    },
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
    SET_SUBJECT(state, { SAU, SAT }) {
      state.data.SAU = SAU;
      state.data.SAT = SAT;
    },
    SET_CURRENT(state, data) {
      state.data.current = data;
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
    fetchSubject: async ({ commit }, subject) => {
      commit("SET_LOADING", true);
      commit("SET_CURRENT", subject);
      try {
        commit("SET_SUBJECT", {
          SAU: await getSubject(subject.JournalId, subject.Evaluations[0]),
          SAT: await getSubject(subject.JournalId, subject.Evaluations[1]),
        });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
