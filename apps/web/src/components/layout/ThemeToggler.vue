<template>
  <Button
    flat
    icon
    :aria-label="component.label"
    @click="settingsStore.toggleTheme"
  >
    <Icon :icon="component.icon" />
  </Button>
</template>

<script setup>
import { computed } from "vue";
import useSettingsStore from "../../stores/settings";
import Button from "../base/Button.vue";
import Icon from "../base/Icon.vue";

const settingsStore = useSettingsStore();

const isDark = {
  true: {
    icon: "akar-icons:sun-fill",
    label: "Turn of night mode",
  },
  false: {
    icon: "akar-icons:moon-fill",
    label: "Turn on night mode",
  },
};

const component = computed(
  () => isDark[settingsStore.settings.theme === "dark"]
);
</script>
