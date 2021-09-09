<template>
  <base-button round @click="toggleTheme()" aria-label="Toogle Theme">
    <sun-icon v-if="theme === 'dark'" />
    <moon-icon v-else />
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
