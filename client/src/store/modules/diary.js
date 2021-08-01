import { getDiary } from "@/api";

const checkIfExists = (array, key, value) => {
  const index = array.findIndex((item) => item[key] === value);
  if (index === -1) return false; // element doesn't exist
  return index;
};

const defaultState = () => {
  return {
    data: [],
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
    ADD_DIARY(state, { data, termId }) {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);
      if (existsAtIndex === false) {
        state.data = [...state.data, { termId: termId, data }];
      } else {
        state.data[existsAtIndex].data = data;
      }
    },
    CLEAR_DIARY(state) {
      Object.assign(state, defaultState());
    },
  },
  getters: {
    getDiary: (state) => {
      return state;
    },
    getDiaryByTermId: (state) => (termId) => {
      const foundItem = state.data.find((item) => item.termId === termId);
      return foundItem instanceof Object ? foundItem.data : [];
    },
  },
  actions: {
    fetchDiary: async ({ commit, state }, termId) => {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);
      if (existsAtIndex === false) commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", { data: await getDiary(termId), termId });
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
