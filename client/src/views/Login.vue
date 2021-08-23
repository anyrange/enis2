<template>
  <div class="flex flex-col h-screen dark:bg-gray-900-spotify">
    <div class="m-auto w-full sm:w-3/5 md:w-1/2 lg:w-2/6 xl:w-1/4 2xl:w-1/5">
      <form class="login-form" @submit.prevent="submit()">
        <div class="flex gap-4 items-center mb-2">
          <app-icon class="w-16 h-16 flex-none" />
          <div class="flex flex-col">
            <h1 class="text-2xl font-medium">enis</h1>
            <h2 class="text-base">resurrected</h2>
          </div>
        </div>
        <base-input
          v-model="user.login"
          type="number"
          autocomplete="username"
          autofocus
          label="Ваш ИИН"
          :max="12"
          :error="errors.login"
        />
        <base-input
          v-model="user.password"
          type="password"
          autocomplete="current-password"
          label="Ваш пароль"
          :error="errors.password"
        />
        <transition name="fade">
          <div v-if="captcha" class="flex justify-between items-center gap-2">
            <div class="w-1/2">
              <img
                class="captcha-img"
                alt="captcha"
                :src="`data:image/png;base64,${captcha}`"
                @click="updateCaptcha()"
              />
            </div>
            <div class="w-1/2">
              <base-input
                v-model="user.captchaInput"
                type="text"
                label="Каптча"
              />
            </div>
          </div>
        </transition>
        <base-select
          v-model="school"
          class="-mt-2"
          label="Школа"
          :options="$options.schools"
        />
        <base-button
          type="submit"
          w-full
          color="primary"
          label="Войти"
          :loading="loading"
        />
        <div class="flex justify-between">
          <theme-toggler />
          <base-button round href="https://github.com/anyrange/enis2">
            <github-icon />
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import BaseSelect from "@/components/BaseSelect";
import ThemeToggler from "@/components/ThemeToggler";
import AppIcon from "@/components/icons/AppIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import { mapActions } from "vuex";
import { refreshCaptcha } from "@/api";
import schools from "@/schools.json";
import { notify } from "@/services/notify";

export default {
  name: "Login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    ThemeToggler,
    AppIcon,
    GithubIcon,
  },
  schools,
  data() {
    return {
      loading: false,
      user: {
        login: "",
        password: "",
        captchaInput: "",
      },
      errors: {
        login: "",
        password: "",
      },
      captcha: "",
      validationStarted: false,
    };
  },
  computed: {
    school: {
      get() {
        return this.$store.state.preferences.school;
      },
      set(value) {
        this.$store.commit("preferences/SET_SCHOOL", value);
      },
    },
    formValidated() {
      return !this.errors.login && !this.errors.password;
    },
  },
  watch: {
    user: {
      handler({ login, password }) {
        if (this.validationStarted) {
          this.validateLogin(login);
          this.validatePassword(password);
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.predictSchool();
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      predictSchool: "preferences/predictSchool",
    }),
    validateLogin(value) {
      this.errors.login = value.length !== 12 ? "Неверный формат" : "";
    },
    validatePassword(value) {
      this.errors.password = value.length < 6 ? "Неверный формат" : "";
    },
    async updateCaptcha() {
      this.captcha = await refreshCaptcha();
    },
    async submit() {
      this.validationStarted = true;
      this.validateLogin(this.user.login);
      this.validatePassword(this.user.password);
      if (!this.formValidated) return;
      try {
        this.loading = true;
        await this.login(this.user);
        this.$router.push({ name: "dashboard" });
      } catch (error) {
        if (error?.response?.data?.data) {
          this.captcha = error.response.data.data.base64img;
          this.user.captchaInput = "";
        }
        notify.show({
          type: "danger",
          message: error?.response?.data?.message || "Что-то пошло не так",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.login-form {
  @apply flex flex-col gap-6 p-4 rounded-md border border-gray-200 dark:border-gray-600-spotify dark:bg-gray-800-spotify;
}
.captcha-img {
  @apply object-contain w-44 h-12 cursor-pointer select-none duration-150 hover:opacity-50;
}
</style>
