<template>
  <base-button round aria-label="Toogle Theme" @click="toggleTheme()">
    <component :is="theme === 'dark' ? 'sun-icon' : 'moon-icon'" />
  </base-button>
</template>

<script>
import BaseButton from "../components/BaseButton.vue";
import MoonIcon from "../components/icons/MoonIcon.vue";
import SunIcon from "../components/icons/SunIcon.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    BaseButton,
    MoonIcon,
    SunIcon,
  },
  computed: {
    ...mapGetters({
      theme: "preferences/getTheme",
    }),
  },
  methods: {
    ...mapActions({
      toggleTheme: "preferences/toggleTheme",
    }),
  },
};
</script>
