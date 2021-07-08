const defaultState = () => {
  return {
    selectedTab: "",
    theme: "",
    city: {
      value: "pvl",
      label: "Павлодар ХБН",
    },
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
    SET_CITY(state, city) {
      state.city = city;
    },
    CLEAR_TAB(state) {
      Object.assign(state, { selectedTab: defaultState().selectedTab });
    },
  },
  getters: {
    getSelectedTab: (state) => {
      return state.selectedTab;
    },
    getTheme: (state) => {
      return state.theme;
    },
    getCity: (state) => {
      return state.city;
    },
  },
  actions: {
    setTab: ({ commit }, tab) => {
      commit("SET_TAB", tab);
    },
    setCity: ({ commit }, city) => {
      commit("SET_CITY", city);
    },
    setTheme({ commit, getters }) {
      const cachedTheme = getters.getTheme;
      const preferedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches;
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
