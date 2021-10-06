<template>
  <div
    class="
      flex flex-col
      h-screen
      bg-gray-50
      dark:bg-gray-900-spotify
      sm:from-transparent sm:to-transparent
      bg-gradient-to-r bg-conic-to-l
      from-sky-400
      to-blue-500
    "
  >
    <div
      class="
        flex flex-col
        w-full
        mt-auto
        sm:m-auto
        w-full
        h-[90%]
        sm:h-auto sm:w-3/5
        md:w-1/2
        xl:w-2/6
        2xl:w-1/5
      "
    >
      <div
        class="
          h-full
          rounded-t-xl
          sm:rounded-md
          shadow-sm
          bg-white
          dark:bg-gray-800-spotify
          p-4
        "
      >
        <main class="grid gap-12 grid-cols-1 h-full">
          <div class="grid gap-6 grid-cols-1 self-center">
            <header class="flex flex-col space-y-4 items-start">
              <app-icon class="w-16 h-16 flex-none" />
              <div>
                <h1 class="text-3xl font-semibold">enis</h1>
                <h2 class="text-base font-light">
                  {{ randomEmoji }} Удобный, быстрый, адаптивный
                </h2>
              </div>
            </header>
            <form
              class="grid gap-4 grid-cols-1 !m-0"
              @submit.prevent="submit()"
            >
              <base-input
                v-model="form.login.value"
                type="number"
                autocomplete="username"
                autofocus
                label="Ваш ИИН"
                mask="############"
                :valid="form.login.valid"
              />
              <base-input
                v-model="form.password.value"
                type="password"
                autocomplete="current-password"
                autofocus
                label="Ваш пароль"
                :valid="form.password.valid"
              />
              <transition name="fade">
                <div
                  v-if="captcha"
                  class="flex flex-col sm:flex-row justify-between space-2"
                >
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

                  <base-input
                    v-model="form.captchaInput"
                    type="text"
                    label="Каптча"
                  />
                </div>
              </transition>
              <base-select
                v-model="school"
                :loading="loadingSchool"
                :options="$options.schools"
              >
                <template #default>Выберите школу</template>
                <template #loading>Угадываю школу...</template>
              </base-select>
              <base-button
                type="submit"
                w-full
                color="primary"
                :loading="loading"
              >
                Войти
              </base-button>
            </form>
          </div>
          <footer class="self-end">
            <div class="flex justify-between items-center">
              <base-button
                flat
                icon
                aria-label="Toogle Theme"
                @click="toggleTheme()"
              >
                <component :is="theme === 'dark' ? 'sun-icon' : 'moon-icon'" />
              </base-button>
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
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from "../components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseSelect from "../components/BaseSelect.vue";
import AppIcon from "../components/icons/AppIcon.vue";
import GithubIcon from "../components/icons/GithubIcon.vue";
import TelegramIcon from "../components/icons/TelegramIcon.vue";
import MoonIcon from "../components/icons/MoonIcon.vue";
import SunIcon from "../components/icons/SunIcon.vue";
import schools from "../assets/schools.json";
import emojis from "../assets/emojis.json";
import { mapActions, mapGetters } from "vuex";
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
    MoonIcon,
    SunIcon,
    TelegramIcon,
  },
  schools,
  data() {
    return {
      loading: false,
      loadingSchool: false,
      validationStarted: false,
      captcha: "",
      form: {
        login: {
          value: "",
          valid: true,
        },
        password: {
          value: "",
          valid: true,
        },
        captchaInput: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      theme: "preferences/getTheme",
    }),
    school: {
      get() {
        return this.$store.state.preferences.school;
      },
      set(value) {
        this.$store.commit("preferences/SET_SCHOOL", value);
      },
    },
    formValidated() {
      return this.form.login.valid && this.form.password.valid;
    },
    randomEmoji() {
      const array = this.$options.emojis;
      return array[Math.floor(Math.random() * array.length)];
    },
  },
  emojis,
  watch: {
    form: {
      handler({ login, password }) {
        if (!this.validationStarted) return;
        this.validateForm({
          login: login.value,
          password: password.value,
        });
      },
      deep: true,
    },
  },
  async created() {
    if (this.school) return;
    this.loadingSchool = true;
    try {
      await this.predictSchool();
    } finally {
      this.loadingSchool = false;
    }
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      predictSchool: "preferences/predictSchool",
      toggleTheme: "preferences/toggleTheme",
    }),
    validateForm({ login, password }) {
      this.form.login.valid = login.length === 12;
      this.form.password.valid = password.length > 6;
    },
    async submit() {
      const form = this.form;

      this.validationStarted = true;
      this.validateForm({
        login: form.login.value,
        password: form.password.value,
      });
      if (!this.formValidated) return;

      this.loading = true;
      try {
        await this.login({
          login: form.login.value,
          password: form.password.value,
          captchaInput: form.captchaInput,
        });
      } catch (error) {
        notify.show({
          type: "danger",
          message: error?.response?.data?.message || "Что-то пошло не так",
        });
        if (error?.response?.data?.data) {
          this.captcha = error.response.data.data.base64img;
          this.form.captchaInput = "";
        }
      } finally {
        this.loading = false;
      }
    },
    async updateCaptcha() {
      try {
        this.captcha = await refreshCaptcha();
      } catch (error) {
        notify.show({
          type: "danger",
          message: error?.response?.data?.message || "Что-то пошло не так",
        });
      }
    },
  },
};
</script>
