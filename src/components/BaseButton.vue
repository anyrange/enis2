<template>
  <div class="base-button-container">
    <span v-if="title" class="base-button-title">
      {{ title }}
    </span>
    <button
      class="base-button"
      :type="type"
      :disabled="disabled || loading"
      :class="buttonClass"
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
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <template v-else>
        {{ label }}
      </template>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: "primary",
    },
    type: {
      type: String,
      required: false,
      default: "button",
    },
    label: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
      default: "",
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
    outlined: {
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
  },
  computed: {
    buttonClass() {
      return {
        "base-button-primary": this.color === "primary",
        "base-button-negative": this.color === "negative",
        "base-button-rounded": this.rounded,
        "base-button-outlined": this.outlined,
        "base-button-fullwidth": this.wFull,
        "base-button-disabled": this.disabled,
      };
    },
  },
};
</script>

<style lang="postcss">
.base-button-container {
  @apply flex gap-2 items-center;
}
.base-button {
  @apply flex items-center rounded-sm justify-center px-10 py-2 uppercase text-center select-none text-sm font-medium focus:outline-none focus:ring-2 shadow;
}
.base-button-title {
  @apply select-none;
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
.base-button-primary {
  @apply focus:ring-blue-200 dark:focus:ring-blue-400 text-white bg-blue-500;
}
.base-button-negative {
  @apply focus:ring-red-200 dark:focus:ring-red-800 text-white bg-red-500 hover:bg-red-600;
}
.base-button-outlined {
  @apply border border-white hover:bg-white hover:bg-opacity-50;
}
</style>
