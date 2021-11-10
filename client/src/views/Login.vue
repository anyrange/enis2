<template>
  <div
    class="
      flex flex-col
      h-screen
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
        sm:h-auto
        w-full
        sm:w-96
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
                :loading="loading && loadingEndpoint === 'CITY'"
                :options="$options.schools"
              >
                <template #default>Выберите школу</template>
                <template #loading>Угадываю школу...</template>
              </base-select>
              <base-checkbox
                id="rememberMe"
                v-model="rememberMe"
                label="Запомнить меня"
              />
              <base-button
                type="submit"
                w-full
                color="primary"
                :loading="loading && loadingEndpoint === 'LOGIN'"
              >
                Войти
              </base-button>
            </form>
          </div>
          <footer class="self-end">
            <div class="flex justify-between items-center">
              <theme-toggler />
              <base-button
                icon
                tag="a"
                flat
                href="https://t.me/joinchat/ToHSvx2gVOBkMzBi"
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
import { mapActions, mapState } from "vuex";
import { refreshCaptcha } from "../api";
import { notify } from "../services/notify.js";
import schools from "../assets/schools.json";
import emojis from "../assets/emojis.json";
import BaseInput from "../components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseSelect from "../components/BaseSelect.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import ThemeToggler from "../components/ThemeToggler.vue";
import AppIcon from "../components/icons/AppIcon.vue";
import GithubIcon from "../components/icons/GithubIcon.vue";
import TelegramIcon from "../components/icons/TelegramIcon.vue";

export default {
  name: "Login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    BaseCheckbox,
    ThemeToggler,
    AppIcon,
    GithubIcon,
    TelegramIcon,
  },
  data() {
    return {
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
      validationStarted: false,
      captcha: "",
    };
  },
  schools,
  emojis,
  computed: {
    ...mapState({
      loading: (state) => state.loader.status,
      loadingEndpoint: (state) => state.loader.endpoint,
    }),
    theme() {
      return this.$store.state.preferences.theme;
    },
    school: {
      get() {
        return this.$store.state.preferences.school;
      },
      set(value) {
        this.$store.commit("preferences/SET_SCHOOL", value);
      },
    },
    rememberMe: {
      get() {
        return this.$store.state.preferences.remember;
      },
      set(value) {
        this.$store.commit("preferences/SET_REMEMBER", value);
      },
    },
    formValidated() {
      return this.form.login.valid && this.form.password.valid;
    },
    randomEmoji() {
      const { emojis } = this.$options;
      return emojis[Math.floor(Math.random() * emojis.length)];
    },
  },
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
    await this.predictSchool();
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      predictSchool: "preferences/predictSchool",
      toggleTheme: "preferences/toggleTheme",
      checkAvailability: "health/checkAvailability",
    }),
    validateForm({ login, password }) {
      this.form.login.valid = login.length === 12;
      this.form.password.valid = password.length > 6;
    },
    async submit() {
      const form = this.form;
      const account = {
        login: form.login.value,
        password: form.password.value,
      };

      this.validationStarted = true;
      this.validateForm(account);

      if (!this.formValidated || !this.school) {
        return;
      }
      try {
        await this.login({
          ...account,
          captchaInput: form.captchaInput,
        });
        this.$store.commit("auth/SET_ACCOUNT", account);
      } catch (error) {
        notify.show({
          type: "danger",
          message: error.response.data.message,
        });
        if (error.response.data && error.response.data.data) {
          this.captcha = error.response.data.data.base64img;
          this.form.captchaInput = "";
        }
        if (error.response.status === 400) {
          return;
        }
        await this.checkAvailability();
      }
    },
    async updateCaptcha() {
      try {
        this.captcha = await refreshCaptcha();
      } catch (error) {
        notify.show({
          type: "danger",
          message: error.response.data.message,
        });
      }
    },
  },
};
</script>
