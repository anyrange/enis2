<template>
  <component
    :is="tag"
    :type="type"
    :disabled="isDisabled"
    :href="href || null"
    :role="tag === 'a' ? 'link' : 'button'"
    :target="target"
    :rel="rel"
    :class="[
      [icon ? 'base-button-icon' : 'base-button-default'],
      [color && `base-button-${color}`],
      [
        isDisabled
          ? `cursor-default`
          : `base-button-${color}--hover cursor-pointer`,
      ],
      { 'base-button-rounded': rounded },
      { 'base-button-round': round },
      { 'base-button-disabled': disabled },
      { 'base-button-fullwidth': wFull },
    ]"
    class="base-button default-focus"
    v-bind="$attrs"
    v-wave="isDisabled ? false : ripple"
    @click.stop="emit('click', $event)"
  >
    <icon v-if="loading" class="animate-spin h-5 w-5" icon="gg:spinner" />
    <template v-else>
      <slot />
    </template>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "standard",
    validator(value) {
      return ["standard", "primary", "negative"].includes(value);
    },
  },
  type: {
    type: String,
    required: false,
    default: "button",
  },
  ripple: {
    type: Boolean,
    required: false,
    default: true,
  },
  tag: {
    type: String,
    required: false,
    default: "button",
    validator(value) {
      return ["button", "a"].includes(value);
    },
  },
  href: {
    type: String,
    required: false,
    default: "",
  },
  target: {
    type: String,
    required: false,
    default: "_blank",
  },
  rel: {
    type: String,
    required: false,
    default: "noopener",
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  wFull: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  rounded: {
    type: Boolean,
    required: false,
    default: false,
  },
  round: {
    type: Boolean,
    required: false,
    default: false,
  },
  icon: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<style scoped>
.base-button {
  @apply flex appearance-none shadow duration-200 transition-colors items-center justify-center uppercase text-center select-none text-sm font-medium visited:text-current;
}
.base-button-icon {
  @apply h-9 w-9 rounded-full;
}
.base-button-default {
  @apply h-9 px-4;
}
.base-button-disabled {
  @apply opacity-20;
}
.base-button-fullwidth {
  @apply w-full;
}
.base-button-rounded {
  @apply rounded-sm;
}
.base-button-round {
  @apply rounded-full;
}
.base-button-standard {
  @apply text-black dark:text-white bg-white dark:bg-secondary-darker transition-none;
}
.base-button-standard--hover {
  @apply hover:bg-opacity-50;
}
.base-button-primary {
  @apply text-white bg-primary;
}
.base-button-primary--hover {
  @apply hover:bg-blue-600;
}
.base-button-negative {
  @apply text-white bg-red-500;
}
.base-button-negative--hover {
  @apply hover:bg-red-600;
}
</style>
