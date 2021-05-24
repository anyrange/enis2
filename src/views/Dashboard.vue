<template>
  <div>
    {{ dash }}
    <button v-on:click="logout()">logout</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  methods: {
    ...mapActions(["logout"]),
  },
  data() {
    return {
      dash: null,
    };
  },
  created() {
    axios
      .get(`http://localhost:8887/dashboard/current`, { withCredentials: true })
      .then((response) => (this.dash = response.data))
      .catch((err) => (this.dash = err.response.data.message));
  },
};
</script>

<style lang="scss" scoped></style>
