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
import { computed, watch, ref, provide } from "vue";
import { storeToRefs } from "pinia";
import useLoaderStore from "@/stores/loader";
import useSettingsStore from "@/stores/settings";
import useHealthStore from "@/stores/health";
import useAuthStore from "@/stores/auth";
import useNavigator from "@/composables/useNavigator";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";

const wrapper = ref();

provide("wrapper", wrapper);

const { isMobile, isSafari } = useNavigator();

const authStore = useAuthStore();
const loaderStore = useLoaderStore();
const settingsStore = useSettingsStore();
const healthStore = useHealthStore();

const { showAvailabilityModal } = storeToRefs(healthStore);

const isDarkTheme = computed(() => settingsStore.settings.theme === "dark");
const isDesktop = computed(() => !isMobile.value && !isSafari.value);

watch(
  [isDarkTheme, isDesktop],
  ([newT, newD]) => {
    const root = document.documentElement.classList;
    const toggle = (value, className) =>
      value ? root.add(className) : root.remove(className);

    toggle(newT, "dark");
    toggle(newD, "custom-scrollbar");
  },
  { immediate: true }
);
</script>
