<template>
  <div>
    <label class="bs-label">
      {{ label }}
    </label>
    <div class="bs-box">
      <button type="button" class="bs-button" @click="shown = !shown">
        {{ modelValue.label }}
        <span class="bs-button-icon">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <ul v-if="shown" class="bs-list">
        <li
          class="bs-list-item"
          :class="[
            option.value === modelValue.value
              ? 'bs-list-item-active'
              : 'bs-list-item-default',
          ]"
          v-for="option in options"
          :key="option"
          @click="handleClick(option)"
        >
          <span
            class="bs-list-item-label"
            :class="[
              option.value === modelValue.value
                ? 'bs-list-item-label-active'
                : '',
            ]"
          >
            {{ option.label }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    modelValue: {
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      shown: false,
    };
  },
  methods: {
    handleClick(option) {
      this.shown = false;
      if (option.value === this.modelValue.value) return;
      this.$emit("update:modelValue", option);
      this.$emit("update", option);
    },
  },
};
</script>

<style lang="postcss" scoped>
.bs-label {
  @apply text-base font-medium select-none text-gray-600-spotify dark:text-gray-500-spotify;
}
.bs-box {
  @apply mt-1 relative;
}
.bs-bg-default {
  @apply bg-gray-50 dark:bg-gray-600-spotify;
}
.bs-button {
  @apply bs-bg-default relative w-full sm:text-sm border border-gray-200 dark:border-gray-800-spotify rounded-sm shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
}
.bs-button-icon {
  @apply absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none;
}
.bs-list {
  @apply bs-bg-default absolute w-full z-10 mt-1 shadow-lg max-h-56 rounded-sm py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm;
}
.bs-list-item {
  @apply text-gray-900 dark:text-gray-100 cursor-pointer select-none relative py-2 pr-9 duration-200;
}
.bs-list-item-active {
  @apply hover:bg-opacity-10 hover:bg-blue-500;
}
.bs-list-item-default {
  @apply hover:bg-opacity-10 hover:bg-gray-500;
}
.bs-list-item-label {
  @apply ml-3 font-normal block truncate;
}
.bs-list-item-label-active {
  @apply text-blue-500;
}
</style>
