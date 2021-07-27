import { nanoid } from "nanoid";
import { createNanoEvents } from "nanoevents";
const emitter = createNanoEvents();

/**
 * @param {('info'|'success'|'warning'|'danger')} type
 */

const notify = {
  show: ({
    id = nanoid(),
    message,
    type = "info",
    delay = 3000,
    progress = true,
    closable = true,
    actions = {},
  }) => {
    emitter.emit("newNotification", {
      id,
      message,
      type,
      delay,
      progress,
      closable,
      actions,
    });
  },
  dismiss: (id) => {
    emitter.emit("dismissNotification", id);
  },
  clear: () => {
    emitter.emit("clearNotifications");
  },
};

export { notify, emitter };
