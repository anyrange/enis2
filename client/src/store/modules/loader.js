import { ENDPOINTS } from "../../settings";

export default {
  namespaced: true,
  state: {
    status: false,
    endpoint: "",
  },
  getters: {
    showLoader: (state) => {
      const hideOnEndpoints = ENDPOINTS.filter((e) => e.hideLoader);
      return (
        !hideOnEndpoints.find((e) => e.name === state.endpoint)?.hideLoader &&
        state.status
      );
    },
    errorMessage: (state) => {
      return ENDPOINTS.find((e) => e.name === state.endpoint).error;
    },
  },
  mutations: {
    SET_LOADING(state, payload) {
      Object.assign(state, payload);
    },
  },
};
