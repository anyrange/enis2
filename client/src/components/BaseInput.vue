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
    label: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: "",
    },
    theme: {
      type: [Boolean, String],
      required: false,
      default: "light",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      gray700: "#282828",
      gray500: "rgb(171, 171, 171)",
      blue500: "rgb(59, 130, 246)",
      blue50: "#EFF6FF",
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
    autofillColor() {
      if (this.theme === "dark") return this.gray700;
      return this.blue50;
    },
    autofillTextColor() {
      if (this.theme === "dark") return "white";
      return "black";
    },
  },
  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style lang="postcss">
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
.autofill-color {
  -webkit-box-shadow: 0 0 0px 1000px v-bind(autofillColor) inset;
}
.autofill-text-color {
  -webkit-text-fill-color: v-bind(autofillTextColor);
}
.md-input-wrapper {
  @apply flex flex-col gap-1;
}
.md-input-box {
  @apply relative;
}
.md-input {
  @apply w-full outline-none h-10 appearance-none focus:outline-none bg-transparent text-base dark:text-white;
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
  @apply autofill-color autofill-text-color;
}
</style>
