export default {
  data() {
    return {
      refreshing: false,
      registration: null,
      updateExists: false,
    };
  },
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.updateExists = true;
      if (this.updateExists) {
        this.$notify.show({
          type: "success",
          message: "Обновление доступно",
          progress: false,
          closable: false,
          actions: [
            {
              title: "Обновить",
              handler: () => {
                this.updateApp();
              },
            },
          ],
        });
      }
    },
    refreshApp() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
    checkForUpdates() {
      document.addEventListener("swUpdated", this.showRefreshUI, {
        once: true,
      });
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (this.refreshing) return;
          this.refreshing = true;
          window.location.reload();
        });
      }
    },
  },
  created() {
    this.checkForUpdates();
  },
};
