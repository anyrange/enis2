<template>
  <div class="flex space-x-2 pb-3 h-9 justify-center items-center">
    <div class="loader-dots block relative w-20">
      <div class="absolute top-0 w-3 h-3 rounded-full bg-q-positive"></div>
      <div class="absolute top-0 w-3 h-3 rounded-full bg-q-warning"></div>
      <div class="absolute top-0 w-3 h-3 rounded-full bg-q-negative"></div>
    </div>
  </div>
</template>

<style scoped>
.loader-dots div {
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.loader-dots div:nth-child(1) {
  left: 8px;
  animation: loader-dots1 0.6s infinite;
}
.loader-dots div:nth-child(2) {
  left: 8px;
  animation: loader-dots2 0.6s infinite;
}
.loader-dots div:nth-child(3) {
  left: 32px;
  animation: loader-dots2 0.6s infinite;
}
.loader-dots div:nth-child(4) {
  left: 56px;
  animation: loader-dots3 0.6s infinite;
}
@keyframes loader-dots1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes loader-dots3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes loader-dots2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
