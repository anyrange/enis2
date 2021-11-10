import { HIDE_LOADER_ON_ENDPOINTS } from "../../settings";

export default {
  namespaced: true,
  state: {
    status: false,
    endpoint: "",
  },
  getters: {
    showLoader: (state) => {
      return !HIDE_LOADER_ON_ENDPOINTS.includes(state.endpoint) && state.status;
    },
  },
  mutations: {
    SET_LOADING(state, payload) {
      Object.assign(state, payload);
    },
  },
};
