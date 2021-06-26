<template>
  <div class="w-full dark:bg-gray-600-spotify rounded-full">
    <div
      class="h-1 rounded-l-full"
      :style="{ width: value + '%' }"
      :class="[strenthColor]"
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
      if (roundedScore >= 85) return "bg-green";
      if (roundedScore >= 65) return "bg-yellow";
      return "bg-red";
    },
  },
};
</script>

<style></style>
