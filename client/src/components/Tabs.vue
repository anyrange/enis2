<template>
  <ul class="tabs">
    <slot />
  </ul>
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

<style lang="postcss" scoped>
.tabs {
  @apply flex justify-between items-center;
}
</style>
