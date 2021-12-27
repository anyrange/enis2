<template>
  <div class="flex justify-between items-center">
    <slot />
  </div>
</template>

<script setup>
import { provide, defineEmits, defineProps, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const active = computed(() => props.modelValue);

provide("state", {
  active: () => active.value,
});

provide("selectTab", (tab) => emit("update:modelValue", tab));
</script>
