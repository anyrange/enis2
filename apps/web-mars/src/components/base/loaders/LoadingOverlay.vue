<template>
  <div
    :class="[
      { loading: active },
      [blocking ? 'loader' : 'loader-non-blocking'],
    ]"
  >
    <div class="spinner" />
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  blocking: {
    type: Boolean,
    default: true,
  },
})
</script>

<style>
.loader-layout {
  transition: opacity 0.2s ease-in-out;
  @apply opacity-0 z-99 items-center justify-center flex;
}
.loader-non-blocking {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @apply loader-layout absolute;
}
.loader {
  @apply loader-layout fixed pointer-events-none left-0 top-0 h-screen w-screen;
  @apply dark:bg-secondary-darkest bg-gray-50;
}

.loading.loader,
.loading.loader-non-blocking {
  opacity: 0.8;
  pointer-events: all;
}

.loader .spinner,
.loader-non-blocking .spinner {
  position: relative;
  height: 32px;
  width: 32px;
  border: 1px rgba(128, 128, 128, 0.14) solid;
  border-radius: 50%;
  animation: loading 0.8s cubic-bezier(0.6, 0.2, 0.1, 1) infinite;
}

.loader .spinner::after,
.loader-non-blocking .spinner::after {
  content: "";
  display: block;
  position: absolute;
  top: -3px;
  height: 6px;
  width: 6px;
  left: 13px;
  @apply bg-secondary-darkest dark:bg-gray-50;
  border-radius: 3px;
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
