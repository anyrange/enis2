import { getGrades } from "../../api";

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
    SET_GRADES(state, result) {
      state.data = result;
    },
    CLEAR_GRADES(state) {
      Object.assign(state, defaultState());
    },
  },
  actions: {
    fetchGrades: async ({ commit, state }) => {
      if (state.data.length) return;
      commit("SET_LOADING", true);
      try {
        commit("SET_GRADES", await getGrades());
      } catch (err) {
        return Promise.reject(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
