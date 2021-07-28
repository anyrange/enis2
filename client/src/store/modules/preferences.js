const defaultState = () => {
  return {
    selectedTab: "",
    theme: "",
    school: {},
  };
};

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_TAB(state, tab) {
      state.selectedTab = tab;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_SCHOOL(state, school) {
      state.school = school;
    },
    CLEAR_TAB(state) {
      Object.assign(state, { selectedTab: defaultState().selectedTab });
    },
  },
  getters: {
    getSelectedTab: (state) => {
      return state.selectedTab;
    },
    getSchool: (state) => {
      return state.school;
    },
    getTheme: (state) => {
      return state.theme;
    },
  },
  actions: {
    setTab: ({ commit }, tab) => {
      commit("SET_TAB", tab);
    },
    setTheme({ commit, getters }) {
      const cachedTheme = getters.getTheme;
      const preferedTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (cachedTheme) {
        commit("SET_THEME", cachedTheme);
      } else if (preferedTheme) {
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
  },
};
