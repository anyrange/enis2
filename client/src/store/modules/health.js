import { ref } from "vue";
import { defineStore } from "pinia";
import { checkSMSavailability } from "@/api";

export default defineStore("health", () => {
  const showAvailabilityModal = ref(false);

  const checkAvailability = async () => {
    try {
      const { alive } = await checkSMSavailability();
      !alive && (showAvailabilityModal.value = true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    showAvailabilityModal,
    checkAvailability,
  };
});
