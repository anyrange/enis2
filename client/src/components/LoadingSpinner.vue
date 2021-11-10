<template>
  <div class="loader" :class="{ loading: $store.getters['loader/showLoader'] }">
    <div class="loader-element" />
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style>
.loader {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  @apply dark:bg-gray-900-spotify bg-gray-50;
}

.loading.loader {
  opacity: 0.8;
  pointer-events: all;
}

.loader .loader-element {
  position: relative;
  height: 32px;
  width: 32px;
  border: 1px rgba(128, 128, 128, 0.14) solid;
  border-radius: 50%;
  animation: loading 0.8s cubic-bezier(0.6, 0.2, 0.1, 1) infinite;
}

.loader .loader-element::after {
  content: "";
  display: block;
  position: absolute;
  top: -3px;
  height: 6px;
  width: 6px;
  left: 13px;
  @apply bg-gray-900-spotify dark:bg-gray-50;
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
