<template>
  <router-view />
  <update-notification />
  <notifications />
</template>

<script>
import Notifications from "@/components/Notifications.vue";
import UpdateNotification from "@/components/UpdateNotification";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Notifications,
    UpdateNotification,
  },
  computed: {
    ...mapGetters({ theme: "getTheme" }),
  },
  watch: {
    theme: {
      handler: function() {
        if (this.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(["setTheme"]),
  },
  created() {
    this.setTheme();
  },
};
</script>
