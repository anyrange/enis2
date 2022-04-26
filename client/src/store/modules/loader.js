import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ENDPOINTS } from "@/config";
import { assign } from "@/utils";
import useGrades from "./grades.js";
import useDiary from "./diary.js";

export default defineStore("loader", () => {
  const gradesStore = useGrades();
  const diaryStore = useDiary();

  const existsContent = computed(() => {
    return diaryStore.currentDiary.exists || gradesStore.currentGrade.exists;
  });

  const loader = ref({
    status: "pending",
    endpoint: null,
  });

  const setLoader = (value) => {
    assign(loader.value, value);
  };

  const isLoading = computed(() => loader.value.status === "loading");

  const loadingEndpoint = computed(() => {
    return ENDPOINTS.find(({ name }) => name === loader.value.endpoint);
  });

  const overlay = computed(() => {
    return {
      active: isLoading.value && loadingEndpoint.value.loader !== "hide",
      blocking:
        isLoading.value &&
        (loadingEndpoint.value.loader === "overlay" || !existsContent.value),
    };
  });

  return {
    loader,
    isLoading,
    setLoader,
    overlay,
  };
});
