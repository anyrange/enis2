import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getTerms } from "@/api";
import { existsAtIndex } from "@/utils";
import useSettingsStore from "./settings.js";

export default defineStore("terms", () => {
  const settingsStore = useSettingsStore();

  const termsData = ref([]);
  const actual = ref(null);

  const YEAR = computed(() => settingsStore.settings.year);
  const TAB = computed(() => settingsStore.settings.tab);

  const matchedTerm = computed(() => {
    return termsData.value.find((item) => {
      return item.yearName === YEAR.value;
    });
  });

  const currentTermId = computed(() => {
    const termData =
      matchedTerm.value &&
      matchedTerm.value.terms.find((term) => {
        return term.Name === TAB.value;
      });
    return termData ? termData.Id : "";
  });

  const terms = computed(() => {
    const fallbackTerms = [
      { Name: "1" },
      { Name: "2" },
      { Name: "3" },
      { Name: "4" },
    ];
    return matchedTerm.value ? matchedTerm.value.terms : fallbackTerms;
  });

  const clearTerms = () => {
    termsData.value = [];
    actual.value = null;
  };

  const shorterTermName = (name) => {
    return name.substring(0, 1);
  };

  const fetchTerms = async ({ yearId, yearName, force }) => {
    const index = existsAtIndex(termsData.value, { yearName });
    const exists = index !== null;

    if (exists && !force) return;

    try {
      const terms = await getTerms(yearId);
      const actualTerm = terms.find((term) => term.isActual);
      actual.value = shorterTermName(actualTerm.Name);
      const formattedTerms = terms.map(({ Id, Name: label }) => ({
        Id,
        Name: shorterTermName(label),
      }));
      if (exists) {
        termsData.value[index].terms = formattedTerms;
      } else {
        const termObject = {
          yearName: yearName,
          terms: formattedTerms,
        };
        termsData.value = [...termsData.value, termObject];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    termsData,
    terms,
    actualTermName: actual,
    currentTermId,
    fetchTerms,
    clearTerms,
  };
});
