import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { getYears } from "../api";
import { findItem } from "../utils";
import useSettingsStore from "./settings.js";

export default defineStore("years", () => {
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);

  const years = useStorage("yearsData", []);
  const actual = useStorage("actualYearName", null);

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

      const reversedYears = data.reverse(); // 2022, 2021 => 2021, 2022
      const formattedYears = reversedYears.map(
        ({ Id: value, Name: label, isActual }) => ({
          value,
          label: shorterYearName(label),
          isActual,
        })
      );
      const actualYearIndex = data.findIndex((year) => year.isActual);
      const firstYearIndex = formattedYears.findIndex((year) => {
        /*
          (hardcoded) 
          The first year that started to work with the new data format
          It is impossible to see marks for previous years
        */
        return year.label === "2019-2020";
      });
      years.value = formattedYears.slice(firstYearIndex, actualYearIndex + 2);

      actual.value = formattedYears.find((year) => year.isActual).label;
      settings.value.year = settings.value.year || actual.value;
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
