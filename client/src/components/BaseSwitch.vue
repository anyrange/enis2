<template>
  <div class="relative inline-block w-11 align-middle select-none">
    <input
      :id="id"
      type="checkbox"
      v-bind="$attrs"
      :checked="modelValue"
      class="
        toggle
        absolute
        block
        w-5
        h-5
        items-center
        rounded-full
        bg-gray-100
        appearance-none
        cursor-pointer
        outline-none
        mx-0.5
        shadow
      "
      style="top: 50%; transform: translateY(-50%)"
      @change="handleInput($event.target.checked)"
    />
    <label
      :for="id"
      class="
        toggle-label
        block
        overflow-hidden
        h-6
        rounded-full
        dark:bg-gray-600-spotify
        bg-gray-300
        cursor-pointer
      "
    />
  </div>
</template>

<script>
export default {
  name: "BaseSwitch",
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.toggle:checked {
  @apply right-0 border-blue-500;
}
.toggle:checked + .toggle-label {
  @apply bg-blue-500;
}
</style>
