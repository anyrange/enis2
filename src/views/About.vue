<template>
  <div class="about">
    <div v-if="message">
      {{ message }}
    </div>
    <form @submit.prevent="submit()">
      <input type="text" v-model="user.login" placeholder="Username" />

      <input type="text" v-model="user.password" placeholder="Password" />

      <button type="submit">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        login: "020606550710",
        password: "arnur123456789!",
      },
      message: "",
    };
  },
  methods: {
    submit() {
      axios.post(`http://127.0.0.1:8887/login`, this.user).then((response) => {
        console.log(response);
        this.message = response;
      });
    },
    toFormData: function(obj) {
      const form_data = new FormData();
      for (let key in obj) {
        form_data.append(key, obj[key]);
      }
      return form_data;
    },
  },
};
</script>
