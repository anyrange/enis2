<template>
  <div
    class="sm:from-transparent sm:to-transparent bg-gradient-to-r bg-conic-to-l from-sky-400 to-primary"
  >
    <div class="flex h-screen">
      <div class="sm:m-auto mt-auto w-full h-[90%] sm:h-auto sm:w-96">
        <main
          class="grid gap-12 grid-cols-1 h-full h-full rounded-t-xl sm:rounded-md shadow-sm bg-white dark:bg-secondary-darker p-4"
        >
          <div class="grid gap-6 grid-cols-1 self-center">
            <header class="flex flex-col space-y-4 items-start">
              <app-logo class="w-16 h-16 flex-none" />
              <div>
                <h1 class="text-3xl font-semibold">enis</h1>
                <h2 class="text-base font-light">
                  {{ randomEmoji }} Удобный, быстрый, адаптивный
                </h2>
              </div>
            </header>
            <form
              class="grid gap-4 grid-cols-1 !m-0"
              @submit.prevent="onSubmit(submit)"
            >
              <base-input
                v-model="form.login"
                type="number"
                autocomplete="username"
                autofocus
                label="Ваш ИИН"
                mask="############"
                :valid="!status.login.isError"
              />
              <base-input
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                autofocus
                label="Ваш пароль"
                :valid="!status.password.isError"
              />
              <transition name="fade">
                <div
                  v-if="captcha"
                  class="flex flex-col sm:flex-row justify-between gap-2"
                >
                  <base-img
                    class="object-contain w-44 h-12 cursor-pointer select-none duration-150 hover:opacity-50"
                    alt="captcha"
                    :src="`data:image/png;base64,${captcha}`"
                    @click="authStore.updateCaptcha"
                  />
                  <div>
                    <base-input
                      v-model="form.captchaInput"
                      type="text"
                      label="Каптча"
                    />
                  </div>
                </div>
              </transition>
              <base-select
                v-model="settings.school"
                :loading="
                  loaderStore.isLoading &&
                  loaderStore.loadingEndpoint === 'CITY'
                "
                :options="schools"
                required
              >
                <template #default>Выберите школу</template>
                <template #loading>Поиск школы...</template>
              </base-select>
              <base-checkbox
                label="Запомнить меня"
                id="rememberMe"
                v-model="settings.rememberMe"
              />
              <base-button type="submit" rounded w-full color="primary">
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
                :href="TG_LINK"
                aria-label="Telegram Link"
              >
                <icon icon="akar-icons:telegram-fill" />
              </base-button>
              <base-button
                icon
                tag="a"
                :href="GH_LINK"
                aria-label="Github Link"
              >
                <icon icon="akar-icons:github-fill" />
              </base-button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from "slimeform";
import { storeToRefs } from "pinia";
import { GH_LINK, TG_LINK } from "@/config";
import schools from "#shared/schools.js";
import useRandom from "@/composables/useRandom";
import { useAuth, useLoader, useSettings, useHealth } from "@/store";
import { isRequired } from "@/utils";

const { randomEmoji } = useRandom();

const authStore = useAuth();
const loaderStore = useLoader();
const settingsStore = useSettings();
const { checkAvailability } = useHealth();

const { captcha } = storeToRefs(authStore);
const { settings } = storeToRefs(settingsStore);

settingsStore.predictSchool();

const { form, status, onSubmit } = useForm({
  form: () => ({
    login: "",
    password: "",
    captchaInput: "",
  }),
  rule: {
    login: [isRequired],
    password: [isRequired],
  },
});

const submit = async () => {
  try {
    await authStore.login({
      login: form.login,
      password: form.password,
      captchaInput: form.captchaInput,
    });
  } catch (error) {
    if (error.response?.data?.data?.base64img) {
      captcha.value = error.response.data.data.base64img;
      form.captchaInput = "";
    }
    await checkAvailability();
  }
};
</script>
