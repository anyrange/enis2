<template>
  <div class="h-screen">
    <loading-overlay :active="showLoader" />
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
import useNavigator from "@/composables/useNavigator";
import useDocument from "@/composables/useDocument";
import { useSettings, useHealth, useLoader } from "@/composables/useStore";
import AvailabilityModal from "@/views/modals/AvailabilityModal.vue";

const { isMobile, isSafari } = useNavigator();
const { toggleClass } = useDocument();
const { setTheme, theme } = useSettings();
const { alive, showAvailabilityModal } = useHealth();
const { showLoader } = useLoader();

setTheme();

watch(alive, (value) => {
  !value && (showAvailabilityModal.value = true);
});

toggleClass(
  computed(() => theme.value === "dark"),
  "dark"
);

toggleClass(
  computed(() => !isMobile.value && !isSafari.value),
  "custom-scrollbar"
);
</script>
