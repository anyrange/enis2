<template>
  <router-view />
  <update-notification />
</template>

<script>
import UpdateNotification from "@/components/UpdateNotification";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    UpdateNotification,
  },
  computed: {
    ...mapGetters({ theme: "getTheme" }),
  },
  methods: {
    ...mapActions(["initTheme"]),
  },
  created() {
    this.initTheme();
  },
  watch: {
    theme: {
      handler: function() {
        if (this.theme === "dark") {
          document.documentElement.classList.add("dark");
          this.$q.dark.set(true);
        } else {
          document.documentElement.classList.remove("dark");
          this.$q.dark.set(false);
        }
      },
      immediate: true,
    },
  },
};
</script>
