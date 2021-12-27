<template>
  <div class="h-full flex flex-col space-y-4 items-center justify-center">
    <span class="text-5xl font-normal leading-7">{{ randomEmoticon }}</span>
    <p class="text-lg text-center font-normal">
      <slot></slot>
    </p>
  </div>
</template>

<script setup>
import useRandom from "@/composables/useRandom";

const { randomEmoticon } = useRandom();
</script>
