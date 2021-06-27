import BaseButton from "@/components/BaseButton.vue";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      toast: useToast(),
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
        this.toast.success(
          {
            component: BaseButton,
            props: {
              wFull: false,
              rounded: true,
              outlined: true,
              color: "",
              title: "Обновление доступно",
              label: "Обновить",
            },
            listeners: {
              click: () => {
                this.refreshApp();
              },
            },
          },
          {
            timeout: false,
            icon: false,
            draggable: false,
            closeOnClick: false,
            closeButton: false,
            position: "bottom-right",
          }
        );
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
