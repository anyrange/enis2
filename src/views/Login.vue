<template>
  <q-form @submit="submit" greedy>
    <q-card-section>
      <q-input
        autofocus
        unelevated
        v-model="user.login"
        label="Your PIN"
        :rules="[
          (val) => (val && val.length === 12) || 'PIN should have 12 symbols',
        ]"
        :lazy-rules="'ondemand'"
        no-error-icon
      />
      <q-input
        type="password"
        unelevated
        v-model="user.password"
        label="Your password"
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        :lazy-rules="'ondemand'"
        no-error-icon
      />
    </q-card-section>
    <q-card-actions class="q-px-md">
      <q-btn
        type="submit"
        unelevated
        color="primary"
        size="md"
        class="full-width"
        label="Login"
        ref="submitBtn"
      />
    </q-card-actions>
  </q-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      user: {
        login: "020606550710",
        password: "arnur123456789!",
      },
    };
  },
  methods: {
    ...mapActions({
      login: "login",
    }),
    submit() {
      this.login({ credentials: this.user })
        .then(() => {
          this.$router.push({ name: "dashboard" });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Error",
            progress: true,
            timeout: 1500,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
