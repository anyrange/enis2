<template>
  <ul class="flex">
    <slot />
  </ul>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    modelValue: {
      type: [String, Number],
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
