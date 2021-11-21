import { getTerms } from "../../api";

const shorterTermName = (name) => {
  return name.substring(0, 1);
};

const existsAtIndex = (state, yearName) => {
  const index = state.data.findIndex((item) => item.yearName === yearName);
  return index === -1 ? null : index;
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
    SET_TERMS(state, { terms, yearName }) {
      const index = existsAtIndex(state, yearName);
      index === null
        ? (state.data = [...state.data, { terms, yearName }])
        : (state.data[index].terms = terms);
    },
    SET_ACTUAL(state, payload) {
      state.actual = payload;
    },
    CLEAR_TERMS(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getTermId:
      (state) =>
      ({ termName, yearName }) => {
        return (
          state.data
            .find((item) => item.yearName === yearName)
            ?.terms.find((term) => term.Name === termName)?.Id || ""
        );
      },
    getCurrentTerms:
      (state) =>
      ({ yearName }) => {
        return (
          state.data.find((item) => item.yearName === yearName)?.terms || [
            { Name: "1" },
            { Name: "2" },
            { Name: "3" },
            { Name: "4" },
          ]
        );
      },
  },
  actions: {
    fetchTerms: async ({ commit, state }, { yearId, yearName, force }) => {
      const exists = existsAtIndex(state, yearName) !== null;
      if (exists && !force) {
        return;
      }
      try {
        const terms = await getTerms(yearId);
        const actualTerm = terms.find((term) => term.isActual);
        !state.actual && commit("SET_ACTUAL", shorterTermName(actualTerm.Name));
        const formattedTerms = terms.map(({ Id, Name: label }) => ({
          Id,
          Name: shorterTermName(label),
        }));
        commit("SET_TERMS", {
          yearName: yearName,
          terms: formattedTerms,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
