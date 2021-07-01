export default {
  namespaced: false,
  state: {
    city: {
      value: "pvl",
      label: "Павлодар ХБН",
    },
  },
  mutations: {
    SET_CITY(state, city) {
      state.city = city;
    },
  },
  getters: {
    getCity(state) {
      return state.city;
    },
  },
  actions: {
    setCity: ({ commit }, city) => {
      commit("SET_CITY", city);
    },
  },
};
