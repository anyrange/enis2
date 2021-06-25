<template>
  <div>
    <button
      v-wave
      class="w-full h-auto flex items-center justify-center px-10 py-2 uppercase text-center text-sm font-medium hover:opacity-80 disabled:opacity-20 transition-all duration-150 ease-linear focus:outline-none focus:ring-2"
      :type="type"
      :disabled="disabled || loading"
      :class="[
        this.color === 'primary' ? 'bg-blue-500 text-white' : '',
        this.color === 'negative'
          ? 'dark:bg-opacity-10 bg-red-700 dark:text-red-500 text-white'
          : '',
        this.rounded ? 'rounded-full' : 'rounded-sm',
      ]"
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
        <slot></slot>
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
    loading: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    rounded: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
