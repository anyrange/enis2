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
        class="w-full h-9 pl-3 pr-6 text-sm appearance-none rounded-sm shadow-sm text-left border border-gray-200 dark:border-secondary-darker default-focus disabled:opacity-60 bg-gray-50 dark:bg-secondary-dark"
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
        <icon icon="ic:round-keyboard-arrow-down" class="w-4 h-4" />
      </div>
    </div>
  </label>
</template>

<script setup>
import { computed } from "vue"
import Icon from "./Icon.vue"

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
})

const emit = defineEmits(["update:modelValue"])

const isDisabled = computed(() => props.disabled || props.loading)

const model = computed({
  get: () => (props.loading ? "loading" : props.modelValue || "none"),
  set: (value) => {
    emit("update:modelValue", value)
  },
})
</script>
