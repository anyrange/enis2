<template>
  <LoadingOverlay
    :active="loaderStore.overlay.active"
    :blocking="loaderStore.overlay.blocking"
  />
  <Modal :show="showAvailabilityModal" @close="showAvailabilityModal = false">
    <AvailabilityContainer />
  </Modal>
  <component :is="authStore.authenticated ? Dashboard : Login" />
  <Notifications />
</template>

<script setup>
import { computed, watch, defineAsyncComponent } from "vue"
import { storeToRefs } from "pinia"
import useLoaderStore from "./stores/loader"
import useSettingsStore from "./stores/settings"
import useHealthStore from "./stores/health"
import useAuthStore from "./stores/auth"
import LoadingOverlay from "./components/base/loaders/LoadingOverlay.vue"
import Modal from "./components/base/Modal.vue"
import AvailabilityContainer from "./components/layout/modal-containers/AvailabilityContainer.vue"
import Notifications from "./components/base/notifications/Notifications.vue"
const Dashboard = defineAsyncComponent(() => import("./views/Dashboard.vue"))
const Login = defineAsyncComponent(() => import("./views/Login.vue"))

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const settingsStore = useSettingsStore()
const healthStore = useHealthStore()

const { showAvailabilityModal } = storeToRefs(healthStore)

const isDarkTheme = computed(() => settingsStore.settings.theme === "dark")

watch(
  isDarkTheme,
  (theme) => {
    const root = document.documentElement.classList

    const toggleClass = (value, className) =>
      value ? root.add(className) : root.remove(className)

    toggleClass(theme, "dark")
  },
  { immediate: true }
)
</script>
