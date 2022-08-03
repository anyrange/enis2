<template>
  <button
    v-if="visible"
    v-wave
    class="tab"
    :class="[
      { 'disabled-tab': isDisabled },
      [isActive ? 'active-tab' : 'inactive-tab'],
    ]"
    @click="activateTab(name)"
  >
    <slot />
  </button>
</template>

<script setup>
import { inject, computed } from "vue";

const props = defineProps({
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
  loading: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(["selected"]);

const state = inject("state");
const selectTab = inject("selectTab");

const active = computed(() => state.active());
const isDisabled = computed(() => props.disabled || props.loading);
const isActive = computed(() => props.name === active.value);

const activateTab = (name) => {
  if (isDisabled.value) {
    return;
  }
  selectTab(name);
  emit("selected", name);
};
</script>

<style scoped>
.tab {
  @apply default-focus ring-inset h-12 w-12;
  @apply flex flex-grow items-center justify-center text-base font-medium;
  @apply cursor-pointer select-none outline-none duration-200;
}
.active-tab {
  @apply text-primary font-semibold;
  box-shadow: 0px 2px 0px 0px #1976d2;
}
@media (hover: hover) {
  .active-tab:hover {
    @apply hover:bg-primary/10;
  }
}
.inactive-tab {
  @apply text-gray-500 dark:text-secondary-lighter;
}
@media (hover: hover) {
  .inactive-tab:hover {
    @apply hover:bg-gray-100 dark:hover:bg-secondary-dark;
  }
}
.disabled-tab {
  @apply opacity-40 pointer-events-none;
}
</style>
