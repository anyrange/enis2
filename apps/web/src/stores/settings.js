import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { getCity } from "../api";
import { DEFAULT_RANGES, schools } from "../config";

export default defineStore("settings", () => {
  const initialState = {
    tab: "",
    year: "",
    theme: "dark",
    school: "",
    rememberMe: false,
    sortBy: "score",
    hideEmpty: false,
  };
  const settings = useStorage("settings", { ...initialState });
  const ranges = useStorage("customRanges", [...DEFAULT_RANGES]);

  const darkTheme = computed({
    get: () => settings.value.theme === "dark",
    set: (value) => {
      settings.value.theme = value ? "dark" : "light";
    },
  });

  const clearSettings = () => {
    Object.assign(
      settings.value,
      // eslint-disable-next-line no-unused-vars
      (({ theme, school, ...o }) => o)(initialState)
    );
  };

  const toggleTheme = () => {
    settings.value.theme = settings.value.theme === "light" ? "dark" : "light";
  };
  const predictSchool = async () => {
    if (settings.value.school) return;
    try {
      const { city, region } = await getCity();
      const predictedSchool = schools.find((item) => {
        return (
          item.city === city ||
          city.includes(item.city) ||
          region.includes(item.city)
        );
      });
      if (city && predictedSchool) {
        settings.value.school = predictedSchool.value;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    toggleTheme,
    clearSettings,
    predictSchool,
    settings,
    darkTheme,
    ranges,
  };
});
