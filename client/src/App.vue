<template>
  <div
    ref="wrapper"
    class="w-screen h-screen m-auto overflow-scroll"
    style="overflow: overlay"
  >
    <loading-overlay
      :active="loaderStore.overlay.active"
      :blocking="loaderStore.overlay.blocking"
    />
    <modal :show="showAvailabilityModal" @close="showAvailabilityModal = false">
      <availability-modal />
    </modal>
    <component :is="authStore.authenticated ? Dashboard : Login" />
    <notifications />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, provide } from "vue";
import { storeToRefs } from "pinia";
import { useLoader, useSettings, useHealth, useAuth } from "@/store";
import useNavigator from "@/composables/useNavigator";
import useDocument from "@/composables/useDocument";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";

const wrapper = ref();

provide("wrapper", wrapper);

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
