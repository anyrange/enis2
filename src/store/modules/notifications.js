export default {
  namespaced: false,
  state: {
    notifications: [],
  },
  mutations: {
    ADD_NOTIFICATION(state, payload) {
      state.notifications.push(payload);
    },
    REMOVE_NOTIFICATION(state, payload) {
      const index = state.notifications.indexOf(payload);
      state.notifications.splice(index, 1);
    },
    RESET_NOTIFICATIONS(state) {
      state.notifications = [];
    },
  },
  getters: {
    getNotifications(state) {
      return state.notifications;
    },
  },
  actions: {
    addNotification: ({ commit, dispatch }, notification) => {
      commit("ADD_NOTIFICATION", notification);
      if (notification.progress && notification.delay > 0) {
        setTimeout(() => {
          dispatch("removeNotification", notification);
        }, notification.delay);
      }
    },
    removeNotification: ({ commit }, notification) => {
      commit("REMOVE_NOTIFICATION", notification);
    },
    resetNotifications: ({ commit }) => {
      commit("RESET_NOTIFICATIONS");
    },
  },
};
