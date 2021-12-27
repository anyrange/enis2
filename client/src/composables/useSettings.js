import { computed } from "vue";
import { useStore } from "vuex";

export default () => {
  const store = useStore();

  const rememberMe = computed({
    get: () => store.state.preferences.remember,
    set: (value) => {
      store.commit("preferences/SET_REMEMBER", value);
    },
  });
  const darkTheme = computed({
    get: () => store.state.preferences.theme === "dark",
    set: (value) => {
      store.commit("preferences/SET_THEME", value ? "dark" : "light");
    },
  });
  const theme = computed(() => store.state.preferences.theme);
  const sortBy = computed({
    get: () => store.state.preferences.sortBy,
    set: (value) => {
      store.commit("preferences/SET_SORT", value);
    },
  });
  const hideEmpty = computed({
    get: () => store.state.preferences.hideEmpty,
    set: (value) => {
      store.commit("preferences/SET_HIDE", value);
    },
  });
  const currentTab = computed({
    get: () => store.state.preferences.tab,
    set: (value) => {
      store.commit("preferences/SET_TAB", value);
    },
  });
  const currentYearName = computed({
    get: () => store.state.preferences.year,
    set: (value) => {
      store.commit("preferences/SET_YEAR", value);
    },
  });
  const school = computed({
    get: () => store.state.preferences.school,
    set: (value) => {
      store.commit("preferences/SET_SCHOOL", value);
    },
  });

  const setTheme = () => store.dispatch("preferences/setTheme");

  const toggleTheme = () => store.dispatch("preferences/toggleTheme");

  const predictSchool = () => store.dispatch("preferences/predictSchool");

  return {
    rememberMe,
    darkTheme,
    theme,
    sortBy,
    hideEmpty,
    currentTab,
    currentYearName,
    school,
    setTheme,
    predictSchool,
    toggleTheme,
  };
};
