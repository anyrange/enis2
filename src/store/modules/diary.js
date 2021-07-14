import { getDiary } from "@/api";

const checkIfExists = (array, key, value) => {
  const index = array.findIndex((item) => item[key] === value);
  if (index === -1) return false; // element doesn't exist
  return index;
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
    ADD_DIARY(state, { response, termId }) {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);

      if (existsAtIndex === false) {
        state.data = [...state.data, { termId: termId, data: response.data }];
      } else {
        state.data[existsAtIndex].data = response.data;
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
  },
  actions: {
    fetchDiary: async ({ commit, state }, termId) => {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);

      if (existsAtIndex === false) commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", { response: await getDiary(termId), termId });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
