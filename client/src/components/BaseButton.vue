<template>
  <component
    :is="tag"
    v-wave="isDisabled ? false : ripple"
    class="base-button"
    :type="type"
    :disabled="isDisabled"
    :href="href"
    :role="tag === 'a' ? 'link' : 'button'"
    :target="target"
    :rel="rel"
    :class="[
      { 'base-button-rounded': rounded },
      { 'base-button-disabled': disabled },
      { 'base-button-fullwidth': wFull },
      { 'base-button-flat': flat },
      [
        isDisabled
          ? `base-button-${color} cursor-default`
          : `base-button-${color} base-button-${color}--hover cursor-pointer`,
      ],
      [icon ? 'base-button-icon' : 'base-button-default'],
    ]"
    v-bind="$attrs"
    @click.stop="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <template v-else>
      <slot />
    </template>
  </component>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    color: {
      type: String,
      required: false,
      default: "primary",
      validator(value) {
        return ["primary", "negative"].includes(value);
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
    icon: {
      type: Boolean,
      required: false,
      default: false,
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["click"],
  computed: {
    isDisabled() {
      return this.disabled || this.loading;
    },
  },
};
</script>

<style lang="postcss">
.base-button {
  @apply flex rounded-sm shadow duration-200 transition-colors items-center justify-center uppercase text-center select-none text-sm font-medium focus:outline-none visited:text-current;
}
.base-button:focus-visible {
  @apply focus:ring-2;
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
  @apply rounded-full;
}
.base-button-flat {
  @apply text-black !dark:text-white !bg-transparent !hover:bg-opacity-10 !hover:bg-black;
}
.base-button-primary {
  @apply text-white bg-blue-500;
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
