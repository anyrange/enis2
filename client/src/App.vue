<template>
  <div :class="{ 'custom-scrollbars': !isMobile }">
    <loading-spinner />
    <modal :show="showAvailabilityModal" @close="showAvailabilityModal = false">
      <div class="flex flex-col space-y-2">
        <h1>
          <span role="img" aria-label="Disappointed Face">😞</span>
        </h1>
        <p>
          <a
            :href="`https://sms.${school}.nis.edu.kz/`"
            target="_blank"
            class="underline"
          >
            Оригинальный клиент</a
          >
          не работает
        </p>
      </div>
    </modal>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Notifications from "./components/Notifications.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import Modal from "./components/Modal.vue";

export default {
  components: {
    Notifications,
    LoadingSpinner,
    Modal,
  },
  computed: {
    ...mapState({
      theme: (state) => state.preferences.theme,
      school: (state) => state.preferences.school,
    }),
    showAvailabilityModal: {
      get() {
        return this.$store.state.health.showAvailabilityModal;
      },
      set(value) {
        this.$store.commit("health/SET_MODAL", value);
      },
    },
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
    this.$store.dispatch("preferences/setTheme");
  },
};
</script>
