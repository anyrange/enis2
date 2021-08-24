import { getUserCity } from "@/api";
import schools from "@/schools.json";

const defaultState = () => {
  return {
    tab: "",
    theme: "",
    school: null,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_TAB(state, tab) {
      state.tab = tab;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_SCHOOL(state, school) {
      state.school = school;
    },
    CLEAR_PREFERENCES(state) {
      Object.assign(state, { tab: defaultState().tab });
    },
  },
  getters: {
    getTab: (state) => {
      return state.tab;
    },
    getCity: (state) => {
      return state.school.value;
    },
    getTheme: (state) => {
      return state.theme;
    },
  },
  actions: {
    setTheme({ commit, getters }) {
      const cachedTheme = getters.getTheme;
      const hasDarkPreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (cachedTheme) {
        commit("SET_THEME", cachedTheme);
      } else if (hasDarkPreference) {
        commit("SET_THEME", "dark");
      } else {
        commit("SET_THEME", "light");
      }
    },
    toggleTheme({ commit, getters }) {
      const currentTheme = getters.getTheme;
      currentTheme === "light"
        ? commit("SET_THEME", "dark")
        : commit("SET_THEME", "light");
    },
    async predictSchool({ commit, state }) {
      if (!state.school) {
        const defaultSchool = schools.find((item) => item.default);
        commit("SET_SCHOOL", defaultSchool);
        try {
          const city = await getUserCity();
          const predictedSchool = schools.find((item) => item.city === city);
          predictedSchool && commit("SET_SCHOOL", predictedSchool);
        } catch (error) {
          // console.dir(error);
        }
      }
    },
  },
};
