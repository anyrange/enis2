<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <form @submit.prevent="submit">
        <div class="login-form">
          <div class="flex gap-4 items-center mb-2">
            <app-icon class="w-16 h-16 flex-none" />
            <div class="flex flex-col">
              <h1 class="text-2xl font-medium">
                enis
              </h1>
              <h2 class="text-base">
                - удобный, быстрый, адаптивный
              </h2>
            </div>
          </div>
          <base-input
            v-model.text="user.login"
            type="number"
            label="Ваш ИИН"
            autofocus
            :theme="theme"
          />
          <base-input
            v-model="user.password"
            type="password"
            label="Ваш пароль"
            :theme="theme"
          />
          <transition name="fade">
            <div
              v-if="captcha"
              class="flex justify-between items-center gap-x-4"
            >
              <img
                class="object-contain w-44 h-12 cursor-pointer select-none duration-150 hover:opacity-50"
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
          <base-button type="submit" :loading="loading" label="Войти" />
          <div class="flex justify-between">
            <a href="#" class="icon-button" @click="toggleTheme()">
              <sun-icon v-if="theme === 'dark'" class="icon" />
              <moon-icon v-else />
            </a>
            <a href="#" class="icon-button" @click="showModal = true">
              <info-icon class="icon" />
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
  <modal :is-open="showModal" @close="showModal = false">
    <template #header>
      <h3>custom header</h3>
    </template>
  </modal>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import AppIcon from "@/components/icons/AppIcon.vue";
import MoonIcon from "@/components/icons/MoonIcon.vue";
import SunIcon from "@/components/icons/SunIcon.vue";
import InfoIcon from "@/components/icons/InfoIcon.vue";
import Modal from "@/components/Modal.vue";
import { mapActions, mapGetters } from "vuex";
import { refreshCaptcha } from "@/api";
import cities from "@/cities.json";

export default {
  name: "login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    Modal,
    AppIcon,
    MoonIcon,
    SunIcon,
    InfoIcon,
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
      errors: {},
      showModal: false,
    };
  },
  computed: {
    ...mapGetters({
      savedCity: "getCity",
      theme: "getTheme",
    }),
  },
  methods: {
    ...mapActions(["toggleTheme", "login", "setCity"]),
    async updateCaptcha() {
      this.captcha = await refreshCaptcha();
    },
    async submit() {
      this.loading = true;
      try {
        await this.login(this.user);
      } catch (error) {
        if (error.response.data.data) {
          this.captcha = error.response.data.data.base64img;
          this.user.captchaInput = "";
        }
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.city = this.savedCity;
  },
};
</script>

<style lang="postcss" scoped>
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
