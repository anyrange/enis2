import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getDiary } from "@/api";
import { existsAtIndex } from "@/utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";
import useTermsStore from "./terms.js";

export default defineStore("diary", () => {
  const settingsStore = useSettingsStore();
  const yearsStore = useYearsStore();
  const termsStore = useTermsStore();

  const diaryData = ref([]);

  const diary = computed(() => {
    const TAB = settingsStore.settings.tab;
    const YEAR = settingsStore.settings.year;
    const SORT_BY = settingsStore.settings.sortBy;
    const HIDE_EMPTY = settingsStore.settings.hideEmpty;

    const matchedDiary = diaryData.value.find((item) => {
      return item.termName === TAB && item.yearName === YEAR;
    });
    const rawDiary = matchedDiary ? matchedDiary.diary : [];

    const sort = {
      name: (array) => array.sort((a, b) => a.Name.localeCompare(b.Name)),
      score: (array) => array.sort((a, b) => b.Score - a.Score),
    };

    const sortedDiary = sort[SORT_BY](rawDiary);

    const filteredDiary = sortedDiary.filter((o) => o.Score !== 0);
    const allEmpty = !filteredDiary.length;

    return HIDE_EMPTY ? (allEmpty ? sortedDiary : filteredDiary) : sortedDiary;
  });

  const clearDiary = () => {
    diaryData.value = [];
  };

  const fetchDiary = async ({ termId, termName, yearName, force = false }) => {
    const index = existsAtIndex(diaryData.value, { termName, yearName });

    const exists = index !== null;
    const isActualTerm = termsStore.actualTermName === termName;
    const isActualYear = yearsStore.actualYearName === yearName;

    if (exists && !force && !(isActualTerm && isActualYear)) return;

    try {
      const { data } = await getDiary(termId);
      if (exists) {
        diaryData.value[index].diary = data;
      } else {
        const diaryObject = {
          diary: data,
          termName,
          yearName,
        };
        diaryData.value = [...diaryData.value, diaryObject];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    diaryData,
    diary,
    fetchDiary,
    clearDiary,
  };
});
