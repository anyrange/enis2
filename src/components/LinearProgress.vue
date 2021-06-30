<template>
  <div class="l-progress-container">
    <div
      class="l-progress-bar"
      :style="{ width: value + '%' }"
      :class="strenthColor"
    >
      &nbsp;
    </div>
  </div>
</template>

<script>
export default {
  name: "LinearProgress",
  props: {
    value: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
  },
  computed: {
    strenthColor() {
      const roundedScore = Math.ceil(this.value);
      if (roundedScore >= 85) return "bg-q-positive";
      if (roundedScore >= 65) return "bg-q-warning";
      return "bg-q-negative";
    },
  },
};
</script>

<style lang="postcss">
.l-progress-container {
  @apply w-full dark:bg-gray-600-spotify rounded-full;
}
.l-progress-bar {
  @apply h-1 rounded-l-full;
}
</style>
