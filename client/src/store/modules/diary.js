import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getDiary } from "@/api";
import { findIndex, findItem } from "@/utils";
import useSettingsStore from "./settings.js";
import useYearsStore from "./years.js";
import useTermsStore from "./terms.js";
import useAuthStore from "./auth.js";

export default defineStore("diary", () => {
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);

  const authStore = useAuthStore();
  const yearsStore = useYearsStore();
  const termsStore = useTermsStore();

  const diaryData = ref([]);

  const matchedDiary = computed(() => {
    return findItem(diaryData.value, {
      yearName: settings.value.year,
      termName: settings.value.tab,
    });
  });

  const diary = computed(() => {
    const rawDiary = matchedDiary.value ? matchedDiary.value.diary : [];

    const sort = {
      name: (array) => array.sort((a, b) => a.Name.localeCompare(b.Name)),
      score: (array) => array.sort((a, b) => b.Score - a.Score),
    };

    const sortedDiary = sort[settings.value.sortBy](rawDiary);

    const filteredDiary = sortedDiary.filter((o) => o.Score !== 0);
    const allEmpty = !filteredDiary.length;

    return settings.value.hideEmpty
      ? allEmpty
        ? sortedDiary
        : filteredDiary
      : sortedDiary;
  });

  const clearDiary = () => {
    diaryData.value = [];
  };

  const fetchDiary = async (force = false) => {
    const termId = termsStore.currentTermId;
    const termName = settings.value.tab;
    const yearName = settings.value.year;

    const { index, exists } = findIndex(diaryData.value, {
      termName,
      yearName,
    });

    const isActualTerm = termsStore.actualTermName === termName;
    const isActualYear = yearsStore.actualYearName === yearName;

    if (exists && !force && !(isActualTerm && isActualYear)) return;

    try {
      const { data, token } = await getDiary(termId);
      authStore.setToken(token);
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
