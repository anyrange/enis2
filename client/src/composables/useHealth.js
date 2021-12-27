import { computed } from "vue";
import { useStore } from "vuex";

export default () => {
  const store = useStore();

  const alive = computed({
    get: () => store.state.health.alive,
    set: (value) => {
      store.commit("health/SET_ALIVE", value);
    },
  });

  const showAvailabilityModal = computed({
    get: () => store.state.health.showAvailabilityModal,
    set: (value) => {
      store.commit("health/SET_MODAL", value);
    },
  });

  const checkAvailability = () => store.dispatch("health/checkAvailability");

  return {
    alive,
    showAvailabilityModal,
    checkAvailability,
  };
};
