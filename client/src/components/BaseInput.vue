<template>
  <div class="flex flex-col space-y-1">
    <div class="relative">
      <input
        v-bind="$attrs"
        :id="label"
        v-maska="mask"
        class="md-input"
        :placeholder="label"
        autocomplete="false"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div class="md-input-underline" />
    </div>
  </div>
</template>

<script>
import { maska } from "maska";
import colors from "windicss/colors";

export default {
  name: "BaseInput",
  directives: {
    maska,
  },
  props: {
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
  },
  emits: ["update:modelValue"],
  data() {
    return {
      gray500: "rgb(171, 171, 171)",
      blue500: "rgb(59, 130, 246)",
      red500: "rgb(239, 68, 68)",
    };
  },
  colors,
  computed: {
    defaultColor() {
      return this.valid
        ? this.$options.colors.gray["500"]
        : this.$options.colors.red["500"];
    },
    activeColor() {
      return this.valid
        ? this.$options.colors.blue["500"]
        : this.$options.colors.red["500"];
    },
  },
};
</script>

<style lang="postcss">
html {
  --autofill-background: #eff6ff;
  --autofill-color: #000000;
}
html.dark {
  --autofill-background: #282828;
  --autofill-color: #ffffff;
}

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
  @apply !text-base font-inter tracking-tight;
}
</style>
