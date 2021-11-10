import { getSubject } from "../../api";

const defaultState = () => {
  return {
    SAU: [],
    SAT: [],
    current: {},
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_SUBJECT(state, subject) {
      Object.assign(state, subject);
    },
    CLEAR_SUBJECT(state) {
      Object.assign(state, defaultState());
    },
  },
  actions: {
    fetchSubject: async ({ commit }, subject) => {
      try {
        commit("SET_SUBJECT", { current: subject });
        commit("SET_SUBJECT", {
          SAU: await getSubject(subject.JournalId, subject.Evaluations[0]),
          SAT: await getSubject(subject.JournalId, subject.Evaluations[1]),
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
