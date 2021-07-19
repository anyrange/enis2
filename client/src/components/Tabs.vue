<template>
  <ul class="tabs">
    <slot />
  </ul>
</template>

<script>
export default {
  name: "Tabs",
  provide() {
    return {
      state: {
        active: () => this.active,
      },
      selectTab: (tab) => this.$emit("update:modelValue", tab),
    };
  },
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
};
</script>

<style lang="postcss" scoped>
.tabs {
  @apply flex justify-between items-center;
}
</style>
