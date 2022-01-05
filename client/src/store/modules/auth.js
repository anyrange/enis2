import { login } from "@/api";
import { isEmpty } from "@/utils";

export default {
  namespaced: true,
  state: {
    token: null,
  },
  mutations: {
    SET_TOKEN(state, value) {
      state.token = value;
    },
  },
  getters: {
    authenticated(state) {
      return !isEmpty(state.token);
    },
  },
  actions: {
    login: async ({ commit }, credentials) => {
      try {
        const { token } = await login(credentials);
        commit("SET_TOKEN", token);
      } catch (err) {
        commit("SET_TOKEN", null);
        return Promise.reject(err);
      }
    },
    logout: ({ commit }) => {
      commit("SET_TOKEN", null);
      commit("preferences/CLEAR_PREFERENCES", null, { root: true });
      commit("years/CLEAR_YEARS", null, { root: true });
      commit("terms/CLEAR_TERMS", null, { root: true });
      commit("diary/CLEAR_DIARY", null, { root: true });
      commit("grades/CLEAR_GRADES", null, { root: true });
      commit("subject/CLEAR_SUBJECT", null, { root: true });
    },
  },
};
