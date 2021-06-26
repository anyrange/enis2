<template>
  <div class="flex justify-center items-center dark:bg-gray-800-spotify">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    active() {
      return this.modelValue;
    },
  },
  provide() {
    return {
      state: {
        active: () => this.active,
      },
      selectTab: (tab) => this.$emit("update:modelValue", tab),
    };
  },
};
</script>
