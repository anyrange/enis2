import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ENDPOINTS } from "@/config";

export default defineStore("loader", () => {
  const loading = ref({
    status: "pending",
    endpoint: null,
  });

  const isLoading = computed(() => loading.value.status === "loading");
  const isError = computed(() => loading.value.status === "error");
  const currentEndpoint = computed(() => {
    return ENDPOINTS.find((enpoint) => enpoint.name === loading.value.endpoint);
  });
  const showLoader = computed(() => {
    return isLoading.value && !currentEndpoint.value?.hideLoader;
  });
  const errorMessage = computed(() => {
    return isError.value && currentEndpoint.value?.error;
  });

  const setLoader = (value) => {
    loading.value = value;
  };

  return {
    loading: isLoading,
    showLoader,
    loadingEndpoint: computed(() => loading.value.endpoint),
    errorMessage,
    setLoader,
  };
});
