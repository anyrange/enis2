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
              <svg
                class="w-16 h-16 flex-none"
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M171.609 299.179C244.213 288.679 300 226.052 300 150.364C300 67.3203 232.843 0 150 0C82.0628 0 24.6744 45.2743 6.22249 107.367C14.4101 106.379 22.1125 106.43 26.7241 107.023C47.6567 110.291 67.2908 121.27 81.1884 137.201C81.7577 134.8 81.7503 132.323 81.7429 129.839C81.7371 127.884 81.7313 125.924 82.0071 123.995C83.4501 113.907 87.0763 103.434 92.3393 94.7143C111.111 63.6132 154.938 55.4171 185.531 73.0601C193.356 77.5728 200.531 83.8355 205.728 91.2695C207.303 93.5233 208.68 95.8665 210.045 98.1897C213.314 103.755 216.516 109.205 222.222 113.036C230.592 118.654 243.126 122.924 253.181 120.396C254.115 120.161 255.062 119.91 256.016 119.658C258.503 118.998 261.036 118.327 263.5 117.898C264.839 117.666 266.529 117.648 267.28 119.011C268.19 120.663 267.286 123.018 266.571 124.57C264.435 129.203 260.942 132.337 256.621 134.896C244.305 142.188 227.658 143.877 215.916 134.904C215.525 139.698 213.792 144.253 212.017 148.684C208.263 158.055 201.848 166.908 193.557 172.773C179.616 182.633 159.868 183.687 144.826 175.792C140.478 173.51 136.693 170.16 133.465 166.482C123.155 154.732 120.012 135.353 126.665 121.125C132.899 107.794 151.481 101.008 163.744 110.52C172.946 117.657 173.501 133.475 164.296 140.916C162.219 142.594 159.493 144.076 156.865 144.617C156.235 144.747 155.58 144.78 154.924 144.814C153.822 144.871 152.718 144.927 151.733 145.441C149.238 146.744 149.372 148.932 150.874 150.978C158.578 161.477 174.904 159.693 183.05 150.882C193.176 139.932 194.404 120.223 187.543 107.345C183.957 100.614 177.843 95.0824 171.198 91.4486C165.677 88.4298 158.029 85.7698 151.703 85.539C131.979 84.819 113.295 99.517 106.91 117.68C96.111 148.399 115.872 176.747 133.089 201.446C135.696 205.187 138.246 208.844 140.622 212.413C157.752 238.146 171.743 268.109 171.609 299.179Z"
                  fill="#0071E5"
                />
                <path
                  d="M171.609 299.179C244.213 288.679 300 226.052 300 150.364C300 67.3203 232.843 0 150 0C82.0628 0 24.6744 45.2743 6.22249 107.367C14.4101 106.379 22.1125 106.43 26.7241 107.023C47.6567 110.291 67.2908 121.27 81.1884 137.201C81.7577 134.8 81.7503 132.323 81.7429 129.839C81.7371 127.884 81.7313 125.924 82.0071 123.995C83.4501 113.907 87.0763 103.434 92.3393 94.7143C111.111 63.6132 154.938 55.4171 185.531 73.0601C193.356 77.5728 200.531 83.8355 205.728 91.2695C207.303 93.5233 208.68 95.8665 210.045 98.1897C213.314 103.755 216.516 109.205 222.222 113.036C230.592 118.654 243.126 122.924 253.181 120.396C254.115 120.161 255.062 119.91 256.016 119.658C258.503 118.998 261.036 118.327 263.5 117.898C264.839 117.666 266.529 117.648 267.28 119.011C268.19 120.663 267.286 123.018 266.571 124.57C264.435 129.203 260.942 132.337 256.621 134.896C244.305 142.188 227.658 143.877 215.916 134.904C215.525 139.698 213.792 144.253 212.017 148.684C208.263 158.055 201.848 166.908 193.557 172.773C179.616 182.633 159.868 183.687 144.826 175.792C140.478 173.51 136.693 170.16 133.465 166.482C123.155 154.732 120.012 135.353 126.665 121.125C132.899 107.794 151.481 101.008 163.744 110.52C172.946 117.657 173.501 133.475 164.296 140.916C162.219 142.594 159.493 144.076 156.865 144.617C156.235 144.747 155.58 144.78 154.924 144.814C153.822 144.871 152.718 144.927 151.733 145.441C149.238 146.744 149.372 148.932 150.874 150.978C158.578 161.477 174.904 159.693 183.05 150.882C193.176 139.932 194.404 120.223 187.543 107.345C183.957 100.614 177.843 95.0824 171.198 91.4486C165.677 88.4298 158.029 85.7698 151.703 85.539C131.979 84.819 113.295 99.517 106.91 117.68C96.111 148.399 115.872 176.747 133.089 201.446C135.696 205.187 138.246 208.844 140.622 212.413C157.752 238.146 171.743 268.109 171.609 299.179Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  d="M135.145 300C59.2757 292.523 0 228.383 0 150.364C0 141.005 0.852919 131.846 2.48508 122.961C11.9133 125.574 21.1008 128.533 30.1639 132.446C44.9662 138.838 59.0352 147.209 71.4422 157.545C109.588 189.326 128.342 235.722 133.417 284.181C133.604 285.968 133.859 287.745 134.115 289.522C134.517 292.318 134.919 295.116 135.056 297.96C135.089 298.64 135.119 299.32 135.145 300Z"
                  fill="#0071E5"
                />
                <path
                  d="M135.145 300C59.2757 292.523 0 228.383 0 150.364C0 141.005 0.852919 131.846 2.48508 122.961C11.9133 125.574 21.1008 128.533 30.1639 132.446C44.9662 138.838 59.0352 147.209 71.4422 157.545C109.588 189.326 128.342 235.722 133.417 284.181C133.604 285.968 133.859 287.745 134.115 289.522C134.517 292.318 134.919 295.116 135.056 297.96C135.089 298.64 135.119 299.32 135.145 300Z"
                  fill="url(#paint1_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="150"
                    y1="0"
                    x2="150"
                    y2="300.728"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#0071E5" />
                    <stop offset="1" stop-color="#4AC3F5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="150"
                    y1="0"
                    x2="150"
                    y2="300.728"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#0071E5" />
                    <stop offset="1" stop-color="#4AC3F5" />
                  </linearGradient>
                </defs>
              </svg>
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
                  loaderStore.loader.endpoint === 'CITY'
                "
                :options="schools"
                required
              >
                <template #default>Выберите школу</template>
                <template #loading>Угадываю школу...</template>
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
import { reactive, computed, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { GH_LINK, TG_LINK } from "@/config";
import schools from "#shared/schools.js";
import useRandom from "@/composables/useRandom";
import { useAuth, useLoader, useSettings, useHealth } from "@/store";

const { randomEmoji } = useRandom();

const authStore = useAuth();
const loaderStore = useLoader();
const settingsStore = useSettings();
const { checkAvailability } = useHealth();

const { captcha } = storeToRefs(authStore);
const { settings } = storeToRefs(settingsStore);

settingsStore.predictSchool();

const validationStarted = ref(false);
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
  form.password.valid = password.length > 0;
};

const submit = async () => {
  const account = {
    login: form.login.value,
    password: form.password.value,
  };
  validationStarted.value = true;
  validateForm(account);
  if (!formValidated.value || !settings.value.school) {
    return;
  }
  try {
    await authStore.login({
      ...account,
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
