<template>
  <div class="notifications-bottom-left">
    <transition-group
      enter-to-class="opacity-100 scale-100"
      enter-active-class="transition ease-out duration-150 transform opacity-0 scale-75"
      leave-active-class="transition ease-in duration-150 transform opacity-0 scale-75"
    >
      <notification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close-notification="removeNotification(notification.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import Notification from "./Notification.vue";
import { emitter } from "../services/notify.js";

export default {
  name: "Notifications",
  components: {
    Notification,
  },
  data() {
    return {
      notifications: [],
    };
  },
  created() {
    emitter.on("newNotification", (notification) => {
      this.addNotification(notification);
    });
    emitter.on("dismissNotification", (id) => {
      this.removeNotification(id);
    });
    emitter.on("clearNotifications", () => {
      this.notifications = [];
    });
  },
  methods: {
    addNotification(notification) {
      this.notifications = [...this.notifications, notification];
      if (notification.progress && notification.delay > 0) {
        setTimeout(() => {
          this.removeNotification(notification.id);
        }, notification.delay);
      }
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter((item) => item.id !== id);
    },
  },
};
</script>

<style lang="postcss">
.notifications-bottom-left {
  @apply fixed bottom-4 left-4 z-40 overflow-x-hidden;
}
</style>
