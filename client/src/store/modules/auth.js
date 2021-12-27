import { login } from "@/api";

export default {
  namespaced: true,
  state: {
    savedAccount: null,
    token: null,
  },
  mutations: {
    SET_TOKEN(state, value) {
      state.token = value;
    },
    SET_ACCOUNT(state, account) {
      state.savedAccount = account;
    },
  },
  getters: {
    authenticated(state) {
      return state.token;
    },
  },
  actions: {
    login: async ({ commit }, credentials) => {
      try {
        const { token } = await login(credentials);
        commit("SET_TOKEN", token);
        commit("SET_ACCOUNT", credentials);
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
