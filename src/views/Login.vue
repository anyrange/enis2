<template>
  <div class="login-wrapper">
    <div class="login-container">
      <form class="login-form" @submit.prevent="submit">
        <div class="app-container">
          <app-icon class="app-icon" />
          <div class="app-meta">
            <h1 class="app-meta-title">enis</h1>
            <h2 class="app-meta-description">- удобный, быстрый, адаптивный</h2>
          </div>
        </div>
        <base-input
          v-model.text="user.login"
          type="number"
          label="Ваш ИИН"
          autofocus
          :theme="theme"
          :error="errors.user.login"
        />
        <base-input
          v-model="user.password"
          type="password"
          label="Ваш пароль"
          :theme="theme"
          :error="errors.user.password"
        />
        <transition name="fade">
          <div v-if="captcha" class="captcha-container">
            <img
              class="captcha-img"
              @click="updateCaptcha()"
              :src="`data:image/png;base64,${captcha}`"
              alt="captcha"
            />
            <base-input
              v-model="user.captchaInput"
              type="text"
              label="Каптча"
              :theme="theme"
            />
          </div>
        </transition>
        <base-select
          v-model="city"
          @update="setCity(city)"
          :options="$options.cities"
          label="Школа"
          class="-mt-2"
        />
        <base-button
          w-full
          v-wave
          type="submit"
          color="primary"
          :loading="loading"
          label="Войти"
        />
        <div class="bottom-options">
          <a href="#" class="icon-button" @click="toggleTheme()">
            <sun-icon v-if="theme === 'dark'" />
            <moon-icon v-else />
          </a>
          <a
            class="icon-button"
            href="https://github.com/anyrange/enis2"
            target="_blank"
          >
            <github-icon class="icon" />
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import BaseSelect from "@/components/BaseSelect";
import AppIcon from "@/components/icons/AppIcon";
import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
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
    AppIcon,
    MoonIcon,
    SunIcon,
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
      theme: "preferences/getTheme",
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
      toggleTheme: "preferences/toggleTheme",
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
.login-form {
  @apply flex flex-col gap-6 p-4 rounded-md border border-gray-200 dark:border-gray-600-spotify dark:bg-gray-800-spotify;
}
.icon-button {
  @apply flex items-center justify-center w-9 h-9 p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600-spotify focus:ring-2 focus:outline-none;
}
.icon-button .icon {
  @apply w-full h-full;
}
</style>
