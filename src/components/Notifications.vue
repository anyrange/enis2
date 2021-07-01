<template>
  <div class="notifications-bottom-left">
    <transition-group
      enter-to-class="opacity-100 scale-100"
      enter-active-class="transition ease-out duration-150 transform opacity-0 scale-75"
      leave-active-class="transition ease-in duration-150 transform opacity-0 scale-75"
    >
      <notification
        v-for="notification in notifications"
        :key="notification"
        :notification="notification"
        @close-notification="removeNotification(notification)"
      >
      </notification>
    </transition-group>
  </div>
</template>

<script>
import Notification from "@/components/Notification";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Notification,
  },
  computed: {
    ...mapGetters({
      notifications: "getNotifications",
    }),
  },
  methods: {
    ...mapActions(["resetNotifications", "removeNotification"]),
  },
  created() {
    this.resetNotifications();
  },
};
</script>

<style lang="postcss">
.notifications-bottom-left {
  @apply absolute bottom-4 left-4 z-40 overflow-x-hidden;
}
</style>
