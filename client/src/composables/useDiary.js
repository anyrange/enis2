import { computed } from "vue";
import { useStore } from "vuex";
import useSettings from "./useSettings.js";

export default () => {
  const store = useStore();
  const { currentYearName, currentTab } = useSettings();

  const diary = computed(() =>
    store.getters["diary/getCurrentDiary"]({
      termName: currentTab.value,
      yearName: currentYearName.value,
    })
  );

  const fetchDiary = (...args) => store.dispatch("diary/fetchDiary", ...args);

  return {
    diary,
    fetchDiary,
  };
};
