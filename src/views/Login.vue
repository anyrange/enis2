<template>
  <q-page class="flex flex-center">
    <q-card class="lg:w-1/3 xl:w-1/4" flat bordered>
      <q-card-section>
        <div class="q-mb-md flex row items-center z">
          <enis-icon style="height: 60px;weight: 60px;" />
          <div class="flex column items-start q-my-sm q-ml-md">
            <div class="text-h5 text-weight-medium text-grey-8">
              enis2
            </div>
            <div class="text-subtitle1">- convenient, fast, adaptive</div>
          </div>
        </div>
        <q-form @submit="submit" greedy>
          <q-input
            autofocus
            unelevated
            v-model="user.login"
            label="Your PIN"
            :rules="[
              (val) =>
                (val && val.length === 12) || 'PIN should have 12 symbols',
            ]"
            :lazy-rules="'ondemand'"
            no-error-icon
          />
          <q-input
            type="password"
            unelevated
            v-model="user.password"
            label="Your password"
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
            :lazy-rules="'ondemand'"
            no-error-icon
          />
          <template v-if="captcha">
            <img :src="`data:image/png;base64,${captcha}`" />
            <q-input
              type="text"
              unelevated
              label="Captcha"
              v-model="user.captchaInput"
              no-error-icon
              class="q-mb-md"
            />
          </template>
          <q-btn
            type="submit"
            unelevated
            color="primary"
            size="md"
            class="full-width"
            label="Login"
            ref="submitBtn"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import EnisIcon from "@/components/icons/EnisIcon";
import api from "@/api";

export default {
  components: {
    EnisIcon,
  },
  data() {
    return {
      user: {
        login: "020606550710",
        password: "arnur123456789!",
        captchaInput: "",
      },
      captcha: "",
    };
  },
  methods: {
    ...mapActions(["auth"]),
    submit() {
      api
        .login(this.user)
        .then((response) => {
          const success = response.success;
          this.auth({ success });
        })
        .catch((error) => {
          if (error.response.data.data) {
            this.captcha = error.response.data.data.base64img;
            this.user.captchaInput = "";
          }
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: error.response.data.message,
            progress: true,
            timeout: 1500,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
}

@media (min-width: 1024px) {
  .lg\:w-1\/3 {
    width: 33.333333%;
  }
}
@media (min-width: 1280px) {
  .xl\:w-1\/4 {
    width: 25%;
  }
}
</style>
