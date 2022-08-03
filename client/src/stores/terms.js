import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { getTerms } from "../api";
import { findIndex, findItem } from "../utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";

export default defineStore("terms", () => {
  const yearsStore = useYearsStore();
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);

  const termsData = useStorage("termsData", []);
  const actual = useStorage("actualTermName", null);

  const matchedTerm = computed(() => {
    return findItem(termsData.value, { yearName: settings.value.year });
  });

  const currentTermId = computed(() => {
    const termData =
      matchedTerm.value &&
      findItem(matchedTerm.value.terms, { Name: settings.value.tab });
    return termData ? termData.Id : "";
  });

  const terms = computed(() => {
    return matchedTerm.value
      ? matchedTerm.value.terms
      : [{ Name: "1" }, { Name: "2" }, { Name: "3" }, { Name: "4" }];
  });

  const clearTerms = () => {
    termsData.value = [];
    actual.value = null;
  };

  const shorterTermName = (name) => {
    return name.substring(0, 1);
  };

  const fetchTerms = async (force = false) => {
    const yearId = yearsStore.currentYearId;
    const yearName = settings.value.year;

    const { index, exists } = findIndex(termsData.value, { yearName });

    if (exists && !force) return;

    try {
      const terms = await getTerms(yearId);

      const actualTerm = terms.find((term) => term.isActual);

      actual.value = shorterTermName(actualTerm.Name);
      settings.value.tab = settings.value.tab || actual.value;

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
