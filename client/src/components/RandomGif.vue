<template>
  <img :src="selectedImage" alt="error-gif" />
</template>

<script>
export default {
  name: "RandomGif",
  data() {
    return {
      selectedImage: null,
      gifs: [],
    };
  },
  async created() {
    this.gifs = await import.meta.glob("../assets/gifs/*.gif");
    this.gifs[`../assets/gifs/${this.randomInteger(1, 4)}.gif`]().then(
      (mod) => {
        this.selectedImage = mod.default;
      }
    );
  },
  methods: {
    randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
};
</script>
