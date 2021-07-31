<template>
  <div class="base-button-container">
    <span v-if="title" class="base-button-title">
      {{ title }}
    </span>
    <button
      v-wave="ripple"
      class="base-button"
      :type="type"
      :disabled="disabled || loading"
      :class="buttonClass"
      @click.stop="handleClick($event)"
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
        <template v-if="label">
          {{ label }}
        </template>
        <template v-else>
          <slot />
        </template>
      </template>
    </button>
  </div>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    color: {
      type: String,
      required: false,
      default: "flat",
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
    label: {
      type: String,
      required: false,
      default: "",
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
  },
  emits: ["click"],
  computed: {
    buttonClass() {
      return {
        "base-button-primary": this.color === "primary",
        "base-button-negative": this.color === "negative",
        "base-button-flat": this.color === "flat",
        "base-button-rounded": this.rounded,
        "base-button-fullwidth": this.wFull,
        "base-button-disabled": this.disabled,
        "base-button-round": this.round,
        "base-button-default": !this.round,
      };
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
      if (this.href) window.open(this.href, this.target);
    },
  },
};
</script>

<style lang="postcss">
.base-button-container {
  @apply flex gap-2 items-center;
}
.base-button {
  @apply flex rounded-sm duration-200 transition-colors items-center justify-center uppercase text-center select-none text-sm font-medium focus:outline-none focus:ring-2;
}
.base-button-title {
  @apply select-none;
}
.base-button-round {
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
  @apply hover:bg-black hover:bg-opacity-10;
}
.base-button-primary {
  @apply focus:ring-blue-200 dark:focus:ring-blue-400 text-white bg-blue-500 hover:bg-blue-600;
}
.base-button-negative {
  @apply focus:ring-red-200 dark:focus:ring-red-800 text-white bg-red-500 hover:bg-red-600;
}
</style>
