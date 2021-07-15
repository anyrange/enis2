<template>
  <div class="md-input-wrapper">
    <div class="md-input-box">
      <input
        class="md-input"
        placeholder=" "
        autocomplete="false"
        v-bind="$attrs"
        :id="label"
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
        <p class="md-input-error" v-if="error">
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
      if (this.error) return this.red500;
      return this.gray500;
    },
    activeColor() {
      if (this.error) return this.red500;
      return this.blue500;
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
html[data-theme="dark"] {
  --autofill-color: #282828;
  --autofill-text-color: #ffffff;
}
.active-text-color {
  color: v-bind(activeColor);
}
.active-border-color {
  border-color: v-bind(activeColor);
}
.default-text-color {
  color: v-bind(defaultColor);
}
.default-border-color {
  border-color: v-bind(defaultColor);
}

.md-input-wrapper {
  @apply flex flex-col gap-1;
}
.md-input-box {
  @apply relative;
}
.md-input {
  @apply w-full outline-none h-10 appearance-none focus:outline-none bg-transparent text-base dark:text-white text-black;
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
  @apply pointer-events-none active-text-color text-xs font-normal;
}
.md-label {
  @apply absolute pointer-events-none block default-text-color text-base origin-top-left;
  transform: translate(0, -30px) scale(1);
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.md-label-focus {
  @apply origin-top-left active-text-color;
  transform: translate(0, -60px) scale(0.75);
}
.md-input-underline {
  @apply border-b default-border-color;
}
.md-input-underline:after {
  @apply absolute left-0 right-0 pointer-events-none border-b-2 active-border-color;
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
  -webkit-text-color: var(--autofill-text-color);
}
</style>
