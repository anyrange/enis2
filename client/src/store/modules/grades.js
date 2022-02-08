import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getGrades } from "@/api";
import { findIndex, findItem } from "@/utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";

export default defineStore("grades", () => {
  const yearsStore = useYearsStore();
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);

  const gradesData = ref([]);

  const grades = computed(() => {
    const matchedGrades = findItem(gradesData.value, {
      yearName: settings.value.year,
    });
    return matchedGrades ? matchedGrades.grades : [];
  });

  const clearGrades = () => {
    gradesData.value = [];
  };

  const fetchGrades = async (force = false) => {
    const yearId = yearsStore.currentYearId;
    const yearName = settings.value.year;

    const { index, exists } = findIndex(gradesData.value, { yearName });
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
