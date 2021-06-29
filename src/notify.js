import $store from "@/store/";

/**
 * @param {('info'|'success'|'warning'|'danger')} type
 */

const notification = {
  show: ({
    message,
    type = "info",
    delay = 3000,
    progress = true,
    closable = true,
    actions,
  }) => {
    $store.dispatch("addNotification", {
      message,
      type,
      delay,
      progress,
      closable,
      actions,
    });
  },
  reset: () => {
    $store.dispatch("resetNotifications");
  },
};

const notify = (app) => {
  app.config.globalProperties.$notify = notification;
};

export { notification, notify };