import { getTerms } from "../../api";

const defaultState = () => {
  return {
    data: [],
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
    fetchTerms: async ({ commit }, id) => {
      commit("SET_LOADING", true);
      try {
        const terms = await getTerms(id);
        const formattedTerms = terms.map(({ Id, Name: label, isActual }) => ({
          Id,
          Name: label.substring(0, 1),
          isActual,
        }));
        commit("SET_TERMS", formattedTerms);
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
