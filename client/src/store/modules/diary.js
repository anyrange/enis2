import { getDiary } from "@/api";

const checkIfExists = (array, key, value) => {
  const index = array.findIndex((item) => item[key] === value);
  return index === -1 ? false : index;
};

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
    getDiaryByTermId: (state) => (termId) => {
      return state.data.find((item) => item.termId === termId)?.data || [];
    },
  },
  actions: {
    fetchDiary: async ({ commit, state }, termId) => {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);
      existsAtIndex === false && commit("SET_LOADING", true);
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
