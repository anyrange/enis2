<template>
  <base-button
    flat
    icon
    aria-label="Toogle Theme"
    @click="settingsStore.toggleTheme"
  >
    <component
      :is="settingsStore.settings.theme === 'dark' ? SunIcon : MoonIcon"
    />
  </base-button>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";
import SunIcon from "./icons/SunIcon.vue";
import MoonIcon from "./icons/MoonIcon.vue";
import { useSettings } from "@/store";

const settingsStore = useSettings();
</script>
