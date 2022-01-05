import { ENDPOINTS, fallbackErrorMessage } from "@/config";

const hideOnEndpoints = ENDPOINTS.filter((e) => e.hideLoader);

export default {
  namespaced: true,
  state: {
    /**
     * @param {('pending'|'loading'|'error')} status
     */
    status: "pending",
    endpoint: null,
  },
  getters: {
    isLoading: (state) => state.status === "loading",
    isError: (state) => state.status === "error",
    isPending: (state) => state.status === "pending",
    loadingEndpoint: ({ endpoint }, { isLoading }) => {
      return isLoading ? endpoint : null;
    },
    showLoader: ({ endpoint }, { isLoading }) => {
      const hideLoader = hideOnEndpoints.find(
        (e) => e.name === endpoint
      )?.hideLoader;
      return !hideLoader && isLoading;
    },
    errorMessage: ({ endpoint }, { isError }) => {
      const message =
        ENDPOINTS.find((e) => e.name === endpoint)?.error ||
        fallbackErrorMessage;
      return isError ? message : null;
    },
  },
  mutations: {
    SET_LOADING(state, payload) {
      Object.assign(state, payload);
    },
  },
};
