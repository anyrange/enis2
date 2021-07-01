import { getDiary } from "@/api";

function checkIfExists(array, key, value) {
  return array.findIndex((item) => item[key] === value);
}

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
    ADD_DIARY(state, { response, termId }) {
      const existsAtIndex = checkIfExists(state.data, "termId", termId);

      if (existsAtIndex !== -1) {
        state.data[existsAtIndex].data = response.data;
      } else {
        state.data.push({
          termId: termId,
          data: response.data,
        });
      }
    },
    CLEAR_STATE(state) {
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

      if (existsAtIndex === -1) commit("SET_LOADING", true);
      try {
        commit("ADD_DIARY", { response: await getDiary(termId), termId });
      } finally {
        commit("SET_LOADING", false);
      }
    },
    clearDiary: ({ commit }) => {
      commit("CLEAR_STATE");
    },
  },
};
