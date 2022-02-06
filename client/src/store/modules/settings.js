import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { getCity } from "@/api";
import schools from "#shared/schools.js";

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
  const settings = reactive({ ...initialState });

  const darkTheme = computed({
    get: () => settings.theme === "dark",
    set: (value) => {
      settings.theme = value ? "dark" : "light";
    },
  });

  const clearSettings = () => {
    Object.assign(settings, (({ theme, school, ...o }) => o)(initialState));
  };

  const toggleTheme = () => {
    settings.theme = settings.theme === "light" ? "dark" : "light";
  };
  const predictSchool = async () => {
    if (settings.school) return;
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
        settings.school = predictedSchool.value;
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
  };
});
