import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { getGrades } from "@/api";
import { findIndex, findItem } from "@/utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";

export default defineStore("grades", () => {
  const yearsStore = useYearsStore();
  const settingsStore = useSettingsStore();

  const gradesData = useStorage("gradesData", []);

  const grades = computed(() => {
    const matchedGrades = findItem(gradesData.value, {
      yearName: settingsStore.settings.year,
    });
    return matchedGrades ? matchedGrades.grades : [];
  });

  const currentGrade = computed(() => {
    return findIndex(gradesData.value, {
      yearName: settingsStore.settings.year,
    });
  });

  const clearGrades = () => {
    gradesData.value = [];
  };

  const fetchGrades = async (force = false) => {
    const yearId = yearsStore.currentYearId;
    const yearName = settingsStore.settings.year;

    const { index, exists } = findIndex(gradesData.value, { yearName });

    if (exists && !force) return;

    try {
      const data = await getGrades(yearId);
      if (exists) {
        gradesData.value[index].grades = data;
      } else {
        const gradeObject = {
          grades: data,
          yearName: yearName,
        };
        gradesData.value = [...gradesData.value, gradeObject];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    gradesData,
    grades,
    currentGrade,
    fetchGrades,
    clearGrades,
  };
});
