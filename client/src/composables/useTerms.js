import { computed } from "vue";
import { useStore } from "vuex";
import useSettings from "./useSettings.js";

export default () => {
  const store = useStore();
  const { currentYearName, currentTab } = useSettings();

  const actualTermName = computed({
    get: () => store.state.terms.actual,
    set: (value) => {
      store.commit("terms/SET_ACTUAL", value);
    },
  });
  const currentTermId = computed(() =>
    store.getters["terms/getTermId"]({
      termName: currentTab.value,
      yearName: currentYearName.value,
    })
  );
  const terms = computed(() =>
    store.getters["terms/getCurrentTerms"]({
      yearName: currentYearName.value,
    })
  );

  const fetchTerms = (...args) => store.dispatch("terms/fetchTerms", ...args);

  return {
    actualTermName,
    currentTermId,
    terms,
    fetchTerms,
  };
};
