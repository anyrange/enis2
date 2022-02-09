<template>
  <div class="h-screen">
    <loading-overlay :active="loaderStore.showLoader" />
    <availability-modal
      :show="showAvailabilityModal"
      @close="showAvailabilityModal = false"
    />
    <component :is="authStore.authenticated ? Dashboard : Login" />
    <notifications />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useLoader, useSettings, useHealth, useAuth } from "@/store";
import useNavigator from "@/composables/useNavigator";
import useDocument from "@/composables/useDocument";
import AvailabilityModal from "@/views/modals/AvailabilityModal.vue";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";

const { isMobile, isSafari } = useNavigator();
const { toggleClass } = useDocument();

const authStore = useAuth();
const loaderStore = useLoader();
const settingsStore = useSettings();
const healthStore = useHealth();

const { showAvailabilityModal } = storeToRefs(healthStore);

onMounted(() => {
  authStore.captcha = null;
  if (authStore.hasToken) {
    authStore.authenticated = true;
  }
});

toggleClass(
  computed(() => settingsStore.settings.theme === "dark"),
  "dark"
);

toggleClass(
  computed(() => !isMobile.value && !isSafari.value),
  "custom-scrollbar"
);
</script>
