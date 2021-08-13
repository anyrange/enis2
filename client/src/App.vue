<template>
  <div :class="{ 'custom-scrollbar': !isMobile }">
    <router-view />
    <notifications />
  </div>
</template>

<script>
import Notifications from "@/components/Notifications";
import { mapGetters, mapActions } from "vuex";
import { notify } from "@/services/notify";

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
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
  watch: {
    theme: {
      handler: function () {
        if (this.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      immediate: true,
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
  methods: {
    ...mapActions({
      setTheme: "preferences/setTheme",
    }),
    showRefreshUI(e) {
      this.registration = e.detail;
      notify.show({
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
};
</script>
