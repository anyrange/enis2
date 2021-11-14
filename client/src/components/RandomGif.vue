<template>
  <img class="max-w-120" :src="randomGIF.src" :alt="randomGIF.name" />
</template>

<script>
import gifs from "../assets/gifs.json";

export default {
  name: "RandomGif",
  computed: {
    randomGIF() {
      const { url, name } = gifs[Math.floor(Math.random() * gifs.length)];
      return {
        src: url,
        name: name,
      };
    },
  },
};
</script>
