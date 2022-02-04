import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getGrades } from "@/api";
import { existsAtIndex } from "@/utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";

export default defineStore("grades", () => {
  const settingsStore = useSettingsStore();
  const yearsStore = useYearsStore();

  const gradesData = ref([]);

  const grades = computed(() => {
    const YEAR = settingsStore.settings.year;

    const matchedGrades = gradesData.value.find((item) => {
      return item.yearName === YEAR;
    });
    return matchedGrades ? matchedGrades.grades : [];
  });

  const clearGrades = () => {
    gradesData.value = [];
  };

  const fetchGrades = async ({ yearId, yearName, force }) => {
    const index = existsAtIndex(gradesData.value, { yearName });

    const exists = index !== null;
    const isActualYear = yearsStore.actualYearName === yearName;

    if (exists && !force && !isActualYear) return;

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
    fetchGrades,
    clearGrades,
  };
});
