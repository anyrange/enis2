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
                :loading="loadingSchool"
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
    <modal
      :show="showDomainNotification"
      @close="showDomainNotification = false"
    >
      <div class="flex flex-col space-y-2">
        <h1>🔥 Мы переехали</h1>
        <p>
          Благодаря
          <a href="https://superhooman.co/" class="underline">
            создателю первого ениша
          </a>
          у нас теперь есть
          <a href="https://enis.que.kz/" class="underline">новый домен</a> и
          сервер, и хоть этот домен также продолжит работать мы не можем
          обеспечить здесь стабильную работу нашего сервера
        </p>
        <a href="https://enis.que.kz/" class="underline">enis.que.kz</a>
      </div>
    </modal>
    <modal
      :show="showAvailabilityNotification"
      @close="showAvailabilityNotification = false"
    >
      <div class="flex flex-col space-y-2">
        <h1>😞</h1>
        <p>
          <a
            :href="`https://sms.${school}.nis.edu.kz/`"
            target="_blank"
            class="underline"
          >
            Оригинальный клиент</a
          >
          не работает
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import BaseInput from "../components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseSelect from "../components/BaseSelect.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import Modal from "../components/Modal.vue";
import AppIcon from "../components/icons/AppIcon.vue";
import GithubIcon from "../components/icons/GithubIcon.vue";
import TelegramIcon from "../components/icons/TelegramIcon.vue";
import MoonIcon from "../components/icons/MoonIcon.vue";
import SunIcon from "../components/icons/SunIcon.vue";
import schools from "../assets/schools.json";
import emojis from "../assets/emojis.json";
import { mapActions, mapGetters } from "vuex";
import { refreshCaptcha, checkSmsAvailability } from "../api";
import { notify } from "../services/notify.js";

export default {
  name: "Login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    BaseCheckbox,
    Modal,
    AppIcon,
    GithubIcon,
    MoonIcon,
    SunIcon,
    TelegramIcon,
  },
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
      showDomainNotification: false,
      showAvailabilityNotification: false,
    };
  },
  schools,
  emojis,
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
      const array = this.$options.emojis;
      return array[Math.floor(Math.random() * array.length)];
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
    if (this.school) return;
    this.loadingSchool = true;
    try {
      await this.predictSchool();
    } finally {
      this.loadingSchool = false;
    }
  },
  mounted() {
    // this.showDomainNotification = window.location.host.includes("enis2");
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
      const account = {
        login: form.login.value,
        password: form.password.value,
      };

      this.validationStarted = true;
      this.validateForm(account);

      if (!this.formValidated || !this.school) return;

      this.loading = true;
      try {
        await this.login({
          ...account,
          captchaInput: form.captchaInput,
        });
        this.$store.commit("auth/SET_ACCOUNT", account);
      } catch (error) {
        notify.show({
          type: "danger",
          message: error?.response?.data?.message || "Что-то пошло не так",
        });
        if (error?.response?.data?.data) {
          this.captcha = error.response.data.data.base64img;
          this.form.captchaInput = "";
        }

        if (error.response.status === 400) return;
        const { alive } = await checkSmsAvailability();
        this.showAvailabilityNotification = !alive;
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
