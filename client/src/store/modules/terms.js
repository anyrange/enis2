import { getTerms } from "../../api";

const defaultState = () => {
  return {
    data: [],
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_TERMS(state, result) {
      state.data = result;
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
    fetchTerms: async ({ commit, state }, { yearId, force = false }) => {
      if (state.data.length && !force) {
        return;
      }
      try {
        const terms = await getTerms(yearId);
        const formattedTerms = terms.map(({ Id, Name: label, isActual }) => ({
          Id,
          Name: label.substring(0, 1),
          isActual,
        }));
        commit("SET_TERMS", formattedTerms);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
