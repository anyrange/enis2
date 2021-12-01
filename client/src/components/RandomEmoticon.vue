<template>
  <div class="h-full flex flex-col space-y-4 items-center justify-center">
    <span class="text-5xl font-normal leading-7">{{ randomEmoticon }}</span>
    <p class="text-lg text-center font-normal">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import emoticons from "../assets/emoticons.json";

export default {
  name: "RandomEmoticon",
  computed: {
    randomEmoticon() {
      return emoticons[Math.floor(Math.random() * emoticons.length)];
    },
  },
};
</script>
