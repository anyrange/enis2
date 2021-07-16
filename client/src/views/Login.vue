<template>
  <div class="login-wrapper">
    <div class="login-container">
      <form class="login-form" @submit.prevent="submit()">
        <div class="app-container">
          <app-icon class="app-icon" />
          <div class="app-meta">
            <h1 class="app-meta-title">enis</h1>
            <h2 class="app-meta-description">resurrected</h2>
          </div>
        </div>
        <base-input
          v-model="user.login"
          type="number"
          autocomplete="username"
          autofocus
          label="Ваш ИИН"
          :max="12"
          :error="errors.user.login"
        />
        <base-input
          v-model="user.password"
          type="password"
          autocomplete="current-password"
          label="Ваш пароль"
          :error="errors.user.password"
        />
        <transition name="fade">
          <div v-if="captcha" class="captcha-container">
            <img
              class="captcha-img"
              alt="captcha"
              :src="`data:image/png;base64,${captcha}`"
              @click="updateCaptcha()"
            />
            <base-input
              v-model="user.captchaInput"
              type="text"
              label="Каптча"
            />
          </div>
        </transition>
        <base-select
          v-model="city"
          class="-mt-2"
          label="Школа"
          :options="$options.cities"
          @update="setCity(city)"
        />
        <base-button
          type="submit"
          w-full
          color="primary"
          label="Войти"
          :loading="loading"
        />
        <div class="bottom-options">
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
import { mapActions, mapGetters } from "vuex";
import { refreshCaptcha } from "@/api";
import cities from "@/cities.json";

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
  cities,
  data() {
    return {
      loading: false,
      user: {
        login: "",
        password: "",
        captchaInput: "",
      },
      captcha: "",
      city: {},
      errors: {
        user: {
          login: "",
          password: "",
        },
      },
      validationStarted: false,
    };
  },
  computed: {
    ...mapGetters({
      savedCity: "preferences/getCity",
    }),
    formValidated() {
      if (!this.errors.user.login && !this.errors.user.password) return true;
      return false;
    },
  },
  watch: {
    "user.login"(value) {
      this.validateLogin(value);
    },
    "user.password"(value) {
      this.validatePassword(value);
    },
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      setCity: "preferences/setCity",
    }),
    validateLogin(value) {
      if (!this.validationStarted) return;
      if (value.length !== 12) {
        this.errors.user.login = "Неверный формат";
      } else {
        this.errors.user.login = "";
      }
    },
    validatePassword(value) {
      if (!this.validationStarted) return;
      if (value.length < 6) {
        this.errors.user.password = "Неверный формат";
      } else {
        this.errors.user.password = "";
      }
    },
    validateForm() {
      this.validationStarted = true;
      this.validateLogin(this.user.login);
      this.validatePassword(this.user.password);
    },
    async updateCaptcha() {
      this.captcha = await refreshCaptcha();
    },
    async submit() {
      this.validateForm();
      if (this.formValidated) {
        try {
          this.loading = true;
          await this.login(this.user);
        } catch (error) {
          if (error.response.data.data) {
            this.captcha = error.response.data.data.base64img;
            this.user.captchaInput = "";
          }
        } finally {
          this.loading = false;
        }
      }
    },
  },
  created() {
    this.city = this.savedCity;
  },
};
</script>

<style lang="postcss" scoped>
.login-wrapper {
  @apply flex flex-col h-screen dark:bg-gray-900-spotify;
}
.login-container {
  @apply m-auto w-full sm:w-3/5 md:w-1/2 lg:w-2/6 xl:w-1/4 2xl:w-1/5;
}
.login-form {
  @apply flex flex-col gap-6 p-4 rounded-md border border-gray-200 dark:border-gray-600-spotify dark:bg-gray-800-spotify;
}
.app-container {
  @apply flex gap-4 items-center mb-2;
}
.app-icon {
  @apply w-16 h-16 flex-none;
}
.app-meta {
  @apply flex flex-col;
}
.app-meta-title {
  @apply text-2xl font-medium;
}
.app-meta-description {
  @apply text-base;
}
.captcha-container {
  @apply flex justify-between items-center gap-x-4;
}
.captcha-img {
  @apply object-contain w-44 h-12 cursor-pointer select-none duration-150 hover:opacity-50;
}
.bottom-options {
  @apply flex justify-between;
}
</style>
