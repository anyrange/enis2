<template>
  <div class="h-screen">
    <loading-overlay :active="loaderStore.showLoader" />
    <availability-modal
      :show="showAvailabilityModal"
      @close="showAvailabilityModal = false"
    />
    <router-view />
    <notifications />
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import AvailabilityModal from "@/views/modals/AvailabilityModal.vue";
import useNavigator from "@/composables/useNavigator";
import useDocument from "@/composables/useDocument";
import { useLoader, useSettings, useHealth } from "@/store";

const { isMobile, isSafari } = useNavigator();
const { toggleClass } = useDocument();

const loaderStore = useLoader();
const settingsStore = useSettings();
const healthStore = useHealth();

const { showAvailabilityModal } = storeToRefs(healthStore);

toggleClass(
  computed(() => settingsStore.settings.theme === "dark"),
  "dark"
);

toggleClass(
  computed(() => !isMobile.value && !isSafari.value),
  "custom-scrollbar"
);
</script>
