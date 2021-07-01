<template>
  <li
    v-if="visible"
    class="tab"
    :class="tabClass"
    @click="activateTab(name)"
    v-wave
  >
    <slot />
  </li>
</template>

<script>
export default {
  name: "Tab",
  inject: ["state", "selectTab"],
  props: {
    name: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    activateTab(name) {
      if (!this.disabled && name !== this.active) return this.selectTab(name);
    },
  },
  computed: {
    tabClass() {
      return {
        "active-tab": this.isActive,
        "default-tab": !this.isActive,
        "disabled-tab": this.disabled,
      };
    },
    active() {
      return this.state.active();
    },
    isActive() {
      if (this.name === this.active) return true;
      return false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.tab {
  @apply h-12 w-12 flex flex-grow items-center justify-center text-base font-medium cursor-pointer select-none duration-200;
}
.active-tab {
  @apply text-blue-500 font-semibold hover:bg-blue-500 hover:bg-opacity-10;
  box-shadow: 0px 2px 0px #1976d2;
}
.default-tab {
  @apply text-gray-500-spotify hover:bg-gray-100 dark:hover:bg-gray-700-spotify;
}
.disabled-tab {
  @apply opacity-40 pointer-events-none;
}
</style>
