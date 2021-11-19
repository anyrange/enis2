import { getTerms } from "../../api";

const shorterTermName = (name) => {
  return name.substring(0, 1);
};

const defaultState = () => {
  return {
    data: [],
    actual: null,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_TERMS(state, result) {
      state.data = result;
    },
    SET_ACTUAL(state, payload) {
      state.actual = payload;
    },
    CLEAR_TERMS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    actualTermName: (state) => {
      return state.data.find((term) => term.isActual).Name;
    },
    getTermIdByName: (state) => (Name) => {
      return state.data.find((item) => item.Name === Name)?.Id || "";
    },
  },
  actions: {
    fetchTerms: async ({ commit, state }, { yearId, force }) => {
      if (!!state.data.length && !force) {
        return;
      }
      try {
        const terms = await getTerms(yearId);
        const actualTerm = terms.find((term) => term.isActual);
        !state.actual && commit("SET_ACTUAL", shorterTermName(actualTerm.Name));
        const formattedTerms = terms.map(({ Id, Name: label, isActual }) => ({
          Id,
          Name: shorterTermName(label),
          isActual,
        }));
        commit("SET_TERMS", formattedTerms);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
