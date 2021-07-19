<template>
  <base-button
    round
    @click="toggleTheme()"
  >
    <sun-icon v-if="theme === 'dark'" />
    <moon-icon v-else />
  </base-button>
</template>

<script>
import BaseButton from "@/components/BaseButton";
import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
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