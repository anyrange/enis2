import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getYears } from "@/api";
import useSettingsStore from "./settings.js";

export default defineStore("years", () => {
  const settingsStore = useSettingsStore();

  const years = ref([]);
  const actual = ref(null);

  const YEAR = computed(() => settingsStore.settings.year);

  const currentYearId = computed(() => {
    const matchedYear = years.value.find((item) => {
      return item.label === YEAR.value;
    });
    return matchedYear ? matchedYear.value : "";
  });

  const clearYears = () => {
    years.value = [];
    actual.value = null;
  };

  const shorterYearName = (name) => {
    return name.substring(0, 9);
  };

  const fetchYears = async ({ force }) => {
    const exists = years.value.length;

    if (exists && !force) return;

    try {
      const data = await getYears();

      const actualYearIndex = data.findIndex((year) => year.isActual);
      const actualYear = data.find((year) => year.isActual);
      actual.value = shorterYearName(actualYear.Name);

      const formattedYears = data
        .slice(actualYearIndex, actualYearIndex + 3)
        .map(({ Id: value, Name: label, isActual }) => ({
          value,
          label: shorterYearName(label),
          isActual,
        }))
        .reverse();

      years.value = formattedYears;
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
