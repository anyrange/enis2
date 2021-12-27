import { computed } from "vue";
import { useStore } from "vuex";
import useSettings from "./useSettings.js";

export default () => {
  const store = useStore();
  const { currentYearName } = useSettings();

  const grades = computed(() =>
    store.getters["grades/getCurrentGrades"]({
      yearName: currentYearName.value,
    })
  );

  const fetchGrades = (...args) =>
    store.dispatch("grades/fetchGrades", ...args);

  return {
    grades,
    fetchGrades,
  };
};
