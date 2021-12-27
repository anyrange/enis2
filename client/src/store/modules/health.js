import { checkSMSavailability } from "@/api";

export default {
  namespaced: true,
  state: {
    alive: true,
    showAvailabilityModal: false,
  },
  mutations: {
    SET_ALIVE(state, value) {
      state.alive = value;
    },
    SET_MODAL(state, value) {
      state.showAvailabilityModal = value;
    },
  },
  actions: {
    checkAvailability: async ({ commit }) => {
      try {
        const { alive } = await checkSMSavailability();
        commit("SET_ALIVE", alive);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
