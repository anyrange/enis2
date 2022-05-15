<template>
  <label class="inline-flex">
    <input
      v-model="model"
      type="checkbox"
      class="appearance-none absolute h-6 w-6 rounded-sm default-focus"
    />
    <div
      class="dark:border-gray-600 border-2 rounded-sm w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 transition-all duration-100 focus-visible:border-primary"
    >
      <icon
        icon="bi:check"
        class="hidden w-3 h-3 text-blue-600 pointer-events-none fill-current"
      />
    </div>
    {{ label }}
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<style scoped>
input:checked + div {
  @apply !border-primary;
}
input:checked + div svg {
  @apply block;
}
</style>
