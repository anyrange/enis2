<template>
  <button
    v-if="visible"
    v-wave
    class="tab"
    :class="[
      { 'disabled-tab': isDisabled },
      [isActive ? 'active-tab' : 'incative-tab'],
    ]"
    @click="activateTab(name)"
  >
    <slot> </slot>
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

<style lang="postcss" scoped>
.tab {
  @apply h-12 w-12 flex flex-grow items-center justify-center text-base font-medium cursor-pointer select-none duration-200 outline-none;
}
.tab:focus-visible {
  @apply focus:ring-2 ring-inset;
}
.active-tab {
  @apply text-blue-500 font-semibold hover:bg-blue-500 hover:bg-opacity-10;
}
.incative-tab {
  @apply text-gray-500 dark:text-gray-500-spotify hover:bg-gray-100 dark:hover:bg-gray-700-spotify;
}
.disabled-tab {
  @apply opacity-40 pointer-events-none;
}
</style>
