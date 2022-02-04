import { ref } from "vue";
import { defineStore } from "pinia";
import { checkSMSavailability } from "@/api";

export default defineStore("health", () => {
  const alive = ref(true);
  const showAvailabilityModal = ref(false);

  const checkAvailability = async () => {
    try {
      const data = await checkSMSavailability();
      alive.value = data.alive;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    alive,
    showAvailabilityModal,
    checkAvailability,
  };
});
