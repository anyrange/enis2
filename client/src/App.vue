<template>
  <div :class="{ 'custom-scrollbars': !isMobile }">
    <loading-spinner />
    <modal :show="showAvailabilityModal" @close="showAvailabilityModal = false">
      <div class="flex flex-col space-y-2">
        <h1>😞</h1>
        <p>
          <a
            :href="`https://sms.${$store.state.preferences.school}.nis.edu.kz/`"
            target="_blank"
            class="underline"
          >
            Оригинальный клиент</a
          >
          не работает
        </p>
      </div>
    </modal>
    <modal :show="showDomainModal" @close="showDomainModal = false">
      <div class="flex flex-col space-y-2">
        <h1>🔥 Мы переехали</h1>
        <p>
          Благодаря
          <a href="https://superhooman.co/" class="underline">
            создателю первого ениша
          </a>
          у нас теперь есть
          <a href="https://enis.que.kz/" class="underline">новый домен</a> и
          сервер, и хоть этот домен также продолжит работать мы не можем
          обеспечить здесь стабильную работу нашего сервера
        </p>
        <a href="https://enis.que.kz/" class="underline">enis.que.kz</a>
      </div>
    </modal>
    <router-view />
    <notifications />
  </div>
</template>

<script>
import Notifications from "./components/Notifications.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import Modal from "./components/Modal.vue";

export default {
  components: {
    Notifications,
    LoadingSpinner,
    Modal,
  },
  data() {
    return {
      updateSW: undefined,
      showDomainModal: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.preferences.theme;
    },
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
    // this.showDomainModal = window.location.host.includes("enis2");
  },
};
</script>
