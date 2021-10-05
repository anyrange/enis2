<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900-spotify">
    <div class="m-auto w-full sm:w-3/5 md:w-1/2 xl:w-2/6 2xl:w-1/5">
      <form
        class="
          grid
          gap-6
          grid-cols-1
          p-4
          rounded-md
          shadow-sm
          bg-white
          dark:bg-gray-800-spotify
        "
        @submit.prevent="submit()"
      >
        <div class="flex space-x-4 items-center mb-2">
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
          <div
            v-if="captcha"
            class="flex justify-between items-center space-x-2"
          >
            <div class="w-1/2">
              <img
                class="
                  object-contain
                  w-44
                  h-12
                  cursor-pointer
                  select-none
                  duration-150
                  hover:opacity-50
                "
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
          :loading="loadingSchool"
          :options="$options.schools"
        >
          <template #default>Выберите школу</template>
          <template #loading>Угадываю школу...</template>
        </base-select>
        <base-button type="submit" w-full color="primary" :loading="loading">
          Войти
        </base-button>
        <div class="flex justify-between items-center">
          <theme-toggler />
          <base-button
            icon
            tag="a"
            flat
            href="http://t.me/enis2nis"
            aria-label="Telegram Link"
          >
            <telegram-icon />
          </base-button>
          <base-button
            icon
            tag="a"
            flat
            href="https://github.com/anyrange/enis2"
            aria-label="Github Link"
          >
            <github-icon />
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "../components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseSelect from "../components/BaseSelect.vue";
import ThemeToggler from "../components/ThemeToggler.vue";
import AppIcon from "../components/icons/AppIcon.vue";
import GithubIcon from "../components/icons/GithubIcon.vue";
import TelegramIcon from "../components/icons/TelegramIcon.vue";
import schools from "../assets/schools.json";
import { mapActions } from "vuex";
import { refreshCaptcha } from "../api";
import { notify } from "../services/notify.js";

export default {
  name: "Login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    AppIcon,
    GithubIcon,
    TelegramIcon,
    ThemeToggler,
  },
  schools,
  data() {
    return {
      loading: false,
      loadingSchool: false,
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
    if (this.school) return;
    try {
      this.loadingSchool = true;
      await this.predictSchool();
    } finally {
      this.loadingSchool = false;
    }
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
