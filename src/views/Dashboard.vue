<template>
  <div>
    <button v-on:click="logout()">logout</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="scss" scoped></style>
