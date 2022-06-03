<template>
  <div class="fixed bottom-4 left-4 z-40 overflow-x-hidden">
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

<script setup>
import { ref } from "vue";
import { emitter } from "@/services/bus.js";

const notifications = ref([]);

const addNotification = (notification) => {
  notifications.value = [...notifications.value, notification];
  if (notification.progress && notification.delay > 0) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.delay);
  }
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((item) => item.id !== id);
};

emitter.on("newNotification", (notification) => {
  addNotification(notification);
});
emitter.on("dismissNotification", (id) => {
  removeNotification(id);
});
emitter.on("clearNotifications", () => {
  notifications.value = [];
});
</script>
