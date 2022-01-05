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
                :options="schools"
              >
                <template #default>Выберите школу</template>
                <template #loading>Угадываю школу...</template>
              </base-select>
              <base-checkbox
                label="Запомнить меня"
                id="rememberMe"
                v-model="rememberMe"
              />
              <base-button type="submit" w-full color="primary">
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
                :href="TG_LINK"
                aria-label="Telegram Link"
              >
                <telegram-icon />
              </base-button>
              <base-button
                icon
                tag="a"
                flat
                :href="GH_LINK"
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

<script setup>
import { reactive, computed, watch, ref } from "vue";
import { GH_LINK, TG_LINK } from "@/config";
import schools from "@/assets/schools.json";
import {
  useAuth,
  useHealth,
  useLoader,
  useSettings,
} from "@/composables/useStore";
import useRandom from "@/composables/useRandom";

const { school, rememberMe, predictSchool } = useSettings();
const { loading, loadingEndpoint } = useLoader();
const { checkAvailability } = useHealth();
const { login, captcha, updateCaptcha, setToken } = useAuth();
const { randomEmoji } = useRandom();

predictSchool();

const form = reactive({
  login: {
    value: "",
    valid: true,
  },
  password: {
    value: "",
    valid: true,
  },
  captchaInput: "",
});
const validationStarted = ref(false);

const formValidated = computed(() => form.login.valid && form.password.valid);

watch(
  form,
  ({ login, password }) => {
    if (!validationStarted.value) return;
    validateForm({
      login: login.value,
      password: password.value,
    });
  },
  {
    deep: true,
  }
);

const validateForm = ({ login, password }) => {
  form.login.valid = login.length === 12;
  form.password.valid = password.length > 6;
};

const submit = async () => {
  const account = {
    login: form.login.value,
    password: form.password.value,
  };
  validationStarted.value = true;
  validateForm(account);
  if (!formValidated.value || !school.value) {
    return;
  }
  try {
    await login({
      ...account,
      captchaInput: form.captchaInput,
    });
  } catch (error) {
    if (error.response.data && error.response.data.data) {
      captcha.value = error.response.data.data.base64img;
      setToken(error.response.data.token);
      form.captchaInput = "";
    }
    if (error.response.status === 400) {
      return;
    }
    await checkAvailability();
  }
};
</script>
