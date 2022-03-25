<template>
  <label class="flex flex-col gap-2">
    <template v-if="label !== false">
      <span class="text-base font-medium">
        {{ label }}
      </span>
    </template>
    <div class="relative inline-block w-full">
      <select
        v-model="model"
        class="w-full h-9 pl-3 pr-6 text-sm appearance-none rounded-sm shadow-sm text-left border border-gray-200 dark:border-gray-800-spotify default-focus disabled:opacity-60 bg-gray-50 dark:bg-gray-700-spotify"
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
        class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
        :class="{ 'opacity-30': isDisabled }"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: [Boolean, String],
    required: false,
    default: false,
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
});

const emit = defineEmits(["update:modelValue"]);

const isDisabled = computed(() => props.disabled || props.loading);

const model = computed({
  get: () => (props.loading ? "loading" : props.modelValue || "none"),
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
