<template>
  <base-button
    flat
    icon
    aria-label="Toogle Theme"
    @click="settingsStore.toggleTheme"
  >
    <sun-icon v-if="settingsStore.settings.theme === 'dark'" />
    <moon-icon v-else />
  </base-button>
</template>

<script setup>
import { useSettings } from "@/store";

const settingsStore = useSettings();
</script>
