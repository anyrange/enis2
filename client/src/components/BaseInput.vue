<template>
  <div class="relative">
    <input
      v-bind="$attrs"
      :id="label"
      v-maska="mask"
      class="md-input"
      :placeholder="label"
      autocomplete="false"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div class="md-input-underline" />
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { maska as vMaska } from "maska";
import colors from "windicss/colors";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  mask: {
    type: [String, Boolean],
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const defaultColor = computed(() =>
  props.valid ? colors.gray["500"] : colors.red["500"]
);
const activeColor = computed(() =>
  props.valid ? colors.blue["500"] : colors.red["500"]
);
</script>

<style scoped>
.md-input {
  caret-color: var(--autofill-color);
  @apply w-full h-10 appearance-none outline-none text-base bg-transparent focus:outline-none;
}
.md-input::-webkit-outer-spin-button,
.md-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.md-input::placeholder {
  color: v-bind(defaultColor);
}

.md-input[type="number"] {
  -moz-appearance: textfield;
}

.md-input-underline {
  @apply border-b;
  border-color: v-bind(defaultColor);
}
.md-input-underline:after {
  @apply absolute left-0 right-0 pointer-events-none border-b-2;
  border-color: v-bind(activeColor);
  bottom: -0.05rem;
  content: "";
  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform: scaleX(0);
}

.md-input:focus ~ .md-input-underline:after {
  transform: scaleX(1);
}
.md-input:not(:placeholder-shown) ~ .md-input-underline:after {
  transform: scaleX(1);
}

.md-input-error {
  @apply pointer-events-none text-xxs leading-3 font-normal;
  color: v-bind(activeColor);
}

.md-input:-webkit-autofill,
.md-input:-webkit-autofill:hover,
.md-input:-webkit-autofill:focus,
.md-input:-webkit-autofill:active {
  box-shadow: 0 0 0px 1000px var(--autofill-background) inset;
  -webkit-box-shadow: 0 0 0px 1000px var(--autofill-background) inset;
  -webkit-text-fill-color: var(--autofill-color);
}

.md-input:-webkit-autofill::first-line {
  @apply !text-base tracking-tight;
}
</style>
