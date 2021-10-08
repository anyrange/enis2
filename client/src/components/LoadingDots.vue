<template>
  <div class="flex space-x-2 p-4 justify-center items-center">
    <div class="circle green-circle" />
    <div class="circle yellow-circle" />
    <div class="circle red-circle" />
  </div>
</template>

<script>
export default {
  name: "LoadingDots",
};
</script>

<style lang="postcss" scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.circle {
  @apply p-2 w-4 h-4 rounded-full;
  animation: bounce 1s infinite;
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
