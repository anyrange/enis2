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
  @apply cursor-pointer select-none duration-200 outline-none;
}
.active-tab {
  @apply text-blue-500 font-semibold;
}
@media (hover: hover) {
  .active-tab:hover {
    @apply hover:bg-blue-500/10;
  }
}
.inactive-tab {
  @apply text-gray-500 dark:text-gray-500-spotify;
}
@media (hover: hover) {
  .inactive-tab:hover {
    @apply hover:bg-gray-100 dark:hover:bg-gray-700-spotify;
  }
}
.disabled-tab {
  @apply opacity-40 pointer-events-none;
}
</style>
