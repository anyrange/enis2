export default {
  namespaced: true,
  state: {
    notifications: [],
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, notification) {
      const index = state.notifications.indexOf(notification);
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
