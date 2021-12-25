import { getSubject } from "../../api";
import {
  getFilteredSection,
  getScores,
  getMaxScores,
  getPercent,
} from "../../utils";

const defaultState = () => {
  return {
    customSections: {
      SAU: [],
      SAT: [],
    },
    originalSections: {
      SAU: [],
      SAT: [],
    },
    originalSubject: {},
    GM: false,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  getters: {
    customSubject: (state) => {
      return {
        ...state.originalSubject,
        Score: getPercent(
          (getScores(getFilteredSection(state.customSections.SAU)) /
            getMaxScores(getFilteredSection(state.customSections.SAU)) /
            2 +
            getScores(getFilteredSection(state.customSections.SAT)) /
              getMaxScores(getFilteredSection(state.customSections.SAT)) /
              2) *
            100
        ),
      };
    },
  },
  mutations: {
    SET_GM(state, mode) {
      state.GM = mode;
    },
    SET_SUBJECT(state, payload) {
      Object.assign(state, payload);
    },
    CLEAR_SUBJECT(state) {
      Object.assign(state, defaultState());
    },
  },
  actions: {
    fetchSubject: async ({ commit }, subject) => {
      try {
        commit("SET_SUBJECT", { originalSubject: subject });
        const sections = {
          SAU: await getSubject(subject.JournalId, subject.Evaluations[0]),
          SAT: await getSubject(subject.JournalId, subject.Evaluations[1]),
        };
        commit("SET_SUBJECT", { originalSections: sections });
        const nonReactiveSections = JSON.parse(JSON.stringify(sections));
        commit("SET_SUBJECT", { customSections: nonReactiveSections });
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
