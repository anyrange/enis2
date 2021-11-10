import { checkSMSavailability } from "../../api";

export default {
  namespaced: true,
  state: {
    alive: true,
  },
  mutations: {
    SET_AVAILABILITY(state, value) {
      state.alive = value;
    },
  },
  actions: {
    checkAvailability: async ({ commit }) => {
      try {
        const { alive } = await checkSMSavailability();
        commit("SET_AVAILABILITY", alive);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
