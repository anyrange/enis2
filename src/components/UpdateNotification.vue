<template>
  <div></div>
</template>
<script>
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
        this.$q.notify({
          color: "positive",
          position: "bottom-left",
          message: "Обновление доступно",
          timeout: 0,
          actions: [
            {
              label: "Обновить",
              color: "white",
              handler: () => {
                this.refreshApp();
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
