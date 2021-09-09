import { getSubject } from "../../api";

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
    SET_SUBJECT(state, subject) {
      Object.assign(state.data, subject);
    },
    CLEAR_SUBJECT(state) {
      Object.assign(state, defaultState());
    },
  },
  actions: {
    fetchSubject: async ({ commit }, subject) => {
      commit("SET_LOADING", true);
      try {
        commit("SET_SUBJECT", { current: subject });
        commit("SET_SUBJECT", {
          SAU: await getSubject(subject.JournalId, subject.Evaluations[0]),
          SAT: await getSubject(subject.JournalId, subject.Evaluations[1]),
        });
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
