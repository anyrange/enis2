<template>
  <div class="flex flex-col space-y-2">
    <label
      v-if="label.length"
      :for="label"
      class="text-base font-medium select-none"
    >
      {{ label }}
    </label>
    <div class="relative inline-block w-full">
      <select
        :id="label"
        v-model="value"
        class="
          w-full
          h-9
          pl-3
          pr-6
          text-sm
          appearance-none
          rounded-sm
          shadow-sm
          text-left
          border border-gray-200
          dark:border-gray-800-spotify
          focus:ring-blue-500
          focus:border-blue-500
          focus:ring-1
          focus:outline-none
          disabled:opacity-60
          bg-gray-50
          dark:bg-gray-700-spotify
        "
        placeholder="Regular input"
        :class="[
          { 'animate-pulse': loading },
          isDisabled ? 'cursor-default' : 'cursor-pointer',
        ]"
        :disabled="isDisabled"
      >
        <option value="none" selected disabled hidden>
          <slot name="default">Выберите что-нибудь</slot>
        </option>
        <template v-if="loading">
          <option value="loading" selected disabled hidden>
            <slot name="loading">Загрузка...</slot>
          </option>
        </template>
        <template v-else>
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </template>
      </select>
      <div
        class="
          absolute
          inset-y-0
          right-0
          flex
          items-center
          px-2
          pointer-events-none
        "
        :class="{ 'opacity-30': isDisabled }"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: [Boolean, String],
      required: false,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    isDisabled() {
      return this.disabled || this.loading;
    },
    value: {
      get() {
        return this.loading ? "loading" : this.modelValue || "none";
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>
