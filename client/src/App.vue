<template>
  <div>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import Notifications from "@/components/Notifications";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Notifications,
  },
  data() {
    return {
      refreshing: false,
      registration: null,
    };
  },
  computed: {
    ...mapGetters({
      theme: "preferences/getTheme",
    }),
  },
  watch: {
    theme: {
      handler: function () {
        if (this.theme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          document.documentElement.classList.remove("dark");
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      setTheme: "preferences/setTheme",
    }),
    showRefreshUI(e) {
      this.registration = e.detail;
      this.$notify.show({
        type: "success",
        message: "Обновление доступно",
        progress: false,
        closable: false,
        actions: [
          {
            title: "Обновить",
            handler: () => {
              this.refreshApp();
            },
          },
        ],
      });
    },
    refreshApp() {
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
  created() {
    this.setTheme();
  },
  mounted() {
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.localStorage.clear();
        window.location.reload();
      });
    }
  },
};
</script>
