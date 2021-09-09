<template>
  <div :class="{ 'custom-scrollbar': !isMobile }">
    <router-view />
    <notifications />
  </div>
</template>

<script>
import Notifications from "./components/Notifications.vue";
import { mapGetters, mapActions } from "vuex";
import { notify } from "./services/notify.js";

export default {
  components: {
    Notifications,
  },
  data() {
    return {
      updateSW: undefined,
      offlineReady: false,
      needRefresh: false,
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
  async mounted() {
    try {
      const { registerSW } = await import("virtual:pwa-register");
      const vm = this;
      this.updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          vm.needRefresh = true;
          notify.show({
            type: "success",
            message: "Обновление доступно",
            progress: false,
            closable: true,
            actions: [
              {
                title: "Обновить",
                handler: () => {
                  vm.updateServiceWorker();
                },
              },
            ],
          });
        },
        onRegistered(swRegistration) {
          swRegistration && vm.handleSWManualUpdates(swRegistration);
        },
        onRegisterError(e) {
          vm.handleSWRegisterError(e);
        },
      });
    } catch {
      console.log("PWA disabled.");
    }
  },
  created() {
    this.setTheme();
  },
  methods: {
    ...mapActions({
      setTheme: "preferences/setTheme",
    }),
    updateServiceWorker() {
      this.updateSW && this.updateSW(true);
    },
    handleSWManualUpdates(swRegistration) {
      console.log(swRegistration);
    },
    handleSWRegisterError(error) {
      console.error(error);
    },
  },
};
</script>
