<template>
  <base-button
    flat
    icon
    aria-label="Toogle Theme"
    @click="$store.dispatch('preferences/toggleTheme')"
  >
    <component
      :is="$store.state.preferences.theme === 'dark' ? 'sun-icon' : 'moon-icon'"
    />
  </base-button>
</template>

<script>
import BaseButton from "./BaseButton.vue";
import SunIcon from "./icons/SunIcon.vue";
import MoonIcon from "./icons/MoonIcon.vue";

export default {
  name: "ThemeToggler",
  components: {
    BaseButton,
    SunIcon,
    MoonIcon,
  },
};
</script>
