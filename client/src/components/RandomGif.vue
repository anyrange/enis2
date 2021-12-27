<template>
  <img :src="randomGIF.src" :alt="randomGIF.name" />
</template>

<script setup>
import useRandom from "@/composables/useRandom";

const { randomGIF } = useRandom();
</script>
