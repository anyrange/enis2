import { getUserCity } from "@/api";
import schools from "@/assets/schools.json";

const defaultState = () => {
  return {
    tab: "",
    year: "",
    theme: "",
    school: "",
    remember: false,
    sortBy: "score",
    hideEmpty: false,
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_TAB(state, tab) {
      state.tab = tab;
    },
    SET_YEAR(state, year) {
      state.year = year;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_SCHOOL(state, school) {
      state.school = school;
    },
    SET_REMEMBER(state, value) {
      state.remember = value;
    },
    SET_SORT(state, value) {
      state.sortBy = value;
    },
    SET_HIDE(state, value) {
      state.hideEmpty = value;
    },
    CLEAR_PREFERENCES(state) {
      Object.assign(state, {
        tab: defaultState().tab,
        year: defaultState().tab,
        sortBy: defaultState().sortBy,
        remember: defaultState().remember,
        hideEmpty: defaultState().hideEmpty,
      });
    },
  },
  actions: {
    setTheme({ commit, state }) {
      commit("SET_THEME", state.theme || "dark");
    },
    toggleTheme({ commit, state }) {
      commit("SET_THEME", state.theme === "light" ? "dark" : "light");
    },
    async predictSchool({ commit, state }) {
      if (state.school) {
        return;
      }
      try {
        const { city } = await getUserCity();
        const predictedSchool = schools.find(
          (item) => item.city === city || city.includes(item.city)
        );
        if (city && predictedSchool) {
          commit("SET_SCHOOL", predictedSchool.value);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
