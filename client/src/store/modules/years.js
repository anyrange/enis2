import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getYears } from "@/api";
import { findItem } from "@/utils";
import useSettingsStore from "./settings.js";

export default defineStore("years", () => {
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);

  const years = ref([]);
  const actual = ref(null);

  const currentYearId = computed(() => {
    const matchedYear = findItem(years.value, { label: settings.value.year });
    return matchedYear ? matchedYear.value : "";
  });

  const clearYears = () => {
    years.value = [];
    actual.value = null;
  };

  const shorterYearName = (name) => {
    return name.substring(0, 9);
  };

  const fetchYears = async (force = false) => {
    const exists = years.value.length;

    if (exists && !force) return;

    try {
      const data = await getYears();

      const actualYear = data.find((year) => year.isActual);

      actual.value = shorterYearName(actualYear.Name);
      settings.value.year = settings.value.year || actual.value;

      const actualYearIndex = data.findIndex((year) => year.isActual);

      years.value = data
        .slice(actualYearIndex, actualYearIndex + 3)
        .map(({ Id: value, Name: label, isActual }) => ({
          value,
          label: shorterYearName(label),
          isActual,
        }))
        .reverse();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    years,
    actualYearName: actual,
    currentYearId,
    fetchYears,
    clearYears,
  };
});
