import { computed } from "vue";
import { useStore } from "vuex";
import useSettings from "./useSettings.js";

export default () => {
  const store = useStore();
  const { currentYearName } = useSettings();

  const years = computed(() => store.state.years);
  const actualYearName = computed(() => store.state.years.actual);
  const currentYearId = computed(() =>
    store.getters["years/getYearId"](currentYearName.value)
  );

  const fetchYears = (...args) => store.dispatch("years/fetchYears", ...args);

  return {
    years,
    actualYearName,
    currentYearId,
    fetchYears,
  };
};
