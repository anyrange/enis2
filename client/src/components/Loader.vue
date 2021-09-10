<template>
  <div class="flex space-x-2 p-4 justify-center items-center">
    <div class="circle green-circle" />
    <div class="circle yellow-circle" />
    <div class="circle red-circle" />
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style lang="postcss" scoped>
.circle {
  @apply p-2 w-4 h-4 rounded-full animate-bounce;
}
.green-circle {
  animation-delay: 0.1s;
  @apply bg-q-positive;
}
.yellow-circle {
  animation-delay: 0.2s;
  @apply bg-q-warning;
}
.red-circle {
  animation-delay: 0.3s;
  @apply bg-q-negative;
}
</style>
