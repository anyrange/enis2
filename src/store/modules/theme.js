export default {
  namespaced: false,
  state: {
    theme: "",
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme;
    },
  },
  getters: {
    getTheme: (state) => {
      return state.theme;
    },
  },
  actions: {
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
