<template>
  <div class="flex flex-col space-y-1">
    <div class="relative">
      <input
        v-bind="$attrs"
        :id="label"
        class="md-input"
        placeholder=" "
        autocomplete="false"
        :value="modelValue"
        @input="handleInput($event.target.value)"
      />
      <label :for="label" class="md-label">
        {{ label }}
      </label>
      <div class="md-input-underline" />
    </div>
    <div class="h-2">
      <transition name="fade">
        <p v-if="error" class="md-input-error">
          {{ error }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    max: {
      type: Number,
      required: false,
      default: Infinity,
    },
    label: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: "",
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
  computed: {
    defaultColor() {
      return this.error ? this.red500 : this.gray500;
    },
    activeColor() {
      return this.error ? this.red500 : this.blue500;
    },
  },
  methods: {
    handleInput(value) {
      if (String(value).length <= this.max) {
        this.$emit("update:modelValue", value);
      }
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="postcss">
html {
  --autofill-color: #eff6ff;
  --autofill-text-color: #000000;
}
html.dark {
  --autofill-color: #282828;
  --autofill-text-color: #ffffff;
}
.md-input-active-color {
  color: v-bind(activeColor);
  border-color: v-bind(activeColor);
}
.md-input-default-color {
  color: v-bind(defaultColor);
  border-color: v-bind(defaultColor);
}
.md-input {
  caret-color: var(--autofill-text-color);
  @apply w-full h-10 appearance-none outline-none text-base bg-transparent focus:outline-none;
}
.md-input::-webkit-outer-spin-button,
.md-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.md-input[type="number"] {
  -moz-appearance: textfield;
}
.md-input-error {
  @apply pointer-events-none text-xs font-normal md-input-active-color;
}
.md-label {
  @apply absolute pointer-events-none block text-base origin-top-left md-input-default-color;
  transform: translate(0, -30px) scale(1);
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.md-label-focus {
  @apply origin-top-left md-input-active-color;
  transform: translate(0, -60px) scale(0.75);
}
.md-input-underline {
  @apply border-b md-input-default-color;
}
.md-input-underline:after {
  @apply absolute left-0 right-0 pointer-events-none border-b-2 md-input-active-color;
  bottom: -0.05rem;
  content: "";
  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform: scaleX(0);
}
.md-input:focus ~ .md-input-underline:after {
  transform: scaleX(1);
}
.md-input:focus + .md-label,
.md-input:not(:placeholder-shown) + .md-label {
  @apply md-label-focus;
}
.md-input:not(:placeholder-shown) ~ .md-input-underline:after {
  transform: scaleX(1);
}
.md-input:-webkit-autofill,
.md-input:-webkit-autofill:hover,
.md-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px var(--autofill-color) inset;
  -webkit-text-fill-color: var(--autofill-text-color);
}
.md-input:-webkit-autofill + .md-label-focus {
  transform: translateY(0) scale(1);
}
</style>
