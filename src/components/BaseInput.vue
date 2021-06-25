<template>
  <div class="flex flex-col gap-1">
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
    <transition name="fade">
      <div class="h-2">
        <p class="active-text-color text-xs font-normal" v-if="error">
          {{ error }}
        </p>
      </div>
    </transition>
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
      type: [Boolean, String],
      required: false,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      red500: "rgb(239, 68, 68)",
      blue500: "rgb(59, 130, 246)",
      gray500: "rgb(171, 171, 171)",
    };
  },
  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
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
.md-input-box {
  @apply relative;
}
.md-input {
  @apply w-full outline-none h-12 appearance-none focus:outline-none bg-transparent text-base dark:text-white;
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
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #e8f0fe inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
