<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
      registration: null,
    };
  },
  methods: {
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
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    }
  },
};
</script>
