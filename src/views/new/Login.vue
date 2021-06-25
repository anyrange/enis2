<template>
  <modal :is-open="showModal" @close="showModal = false">
    <template #header>
      <h3>custom header</h3>
    </template>
  </modal>
  <div class="flex h-screen" tabindex="-1">
    <div class="m-auto">
      <form @submit.prevent="submit">
        <div
          class="flex flex-col gap-6 p-4 rounded-lg border border-gray-200 dark:border-gray-600-spotify dark:bg-gray-800-spotify"
        >
          <div class="flex flex-row gap-4 items-center">
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
            :error="v$.user.login?.$errors[0]?.$message || false"
          />
          <base-input
            v-model="user.password"
            type="password"
            label="Ваш пароль"
            :error="v$.user.password?.$errors[0]?.$message || false"
          />
          <transition name="fade">
            <div v-if="captcha" class="flex items-center w-full gap-4">
              <img
                class="w-1/2 object-contain h-full cursor-pointer hover:opacity-50"
                @click="updateCaptcha()"
                :src="`data:image/png;base64,${captcha}`"
                alt="captcha"
              />
              <base-input
                v-model="user.captchaInput"
                class="w-1/2"
                type="text"
                label="Каптча"
                :error="v$.user.captchaInput?.$errors[0]?.$message || false"
              />
            </div>
          </transition>
          <base-select
            v-model="city"
            :options="$options.citiesList"
            label="Школа"
            class="-mt-2"
          />
          <base-button type="submit" :loading="loading">
            Войти
          </base-button>

          <div class="flex justify-between">
            <span
              class="dark:text-white text-black w-8 h-8 cursor-pointer"
              @click="toggleTheme()"
            >
              <svg
                v-if="theme === 'dark'"
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
                class="w-full h-full"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <g>
                    <g>
                      <path
                        d="M11.1,12.08c-2-3.88-0.92-7.36,0.07-9.27c0.19-0.36-0.12-0.77-0.53-0.72C5.62,2.77,1.78,7.16,1.99,12.41 c0.01,0,0.01,0,0.01,0.01C2.62,12.15,3.29,12,4,12c1.66,0,3.18,0.83,4.1,2.15C9.77,14.63,11,16.17,11,18 c0,1.52-0.87,2.83-2.12,3.51c0.98,0.32,2.03,0.5,3.11,0.5c3.13,0,5.92-1.44,7.76-3.69c0.26-0.32,0.04-0.79-0.37-0.82 C16.89,17.37,13.1,15.97,11.1,12.08z"
                      />
                    </g>
                    <path
                      d="M7,16l-0.18,0C6.4,14.84,5.3,14,4,14c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.62,0,2.49,0,3,0c1.1,0,2-0.9,2-2 C9,16.9,8.1,16,7,16z"
                    />
                  </g>
                </g>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
                class="w-full h-full"
              >
                <rect fill="none" height="24" width="24" />
                <path
                  d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"
                />
              </svg>
            </span>
            <span
              class="dark:text-white text-black w-8 h-8 cursor-pointer"
              @click="showModal = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
                class="w-full h-full"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                />
              </svg>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import Modal from "@/components/Modal.vue";
import { mapActions, mapGetters } from "vuex";
import { refreshCaptcha } from "@/api";
import useValidate from "@vuelidate/core";
import {
  required,
  maxLength,
  helpers,
  minLength,
  numeric,
} from "@vuelidate/validators";
import cities from "@/cities.json";

export default {
  name: "login",
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    Modal,
  },
  citiesList: cities,
  defaultCity: {
    value: "sms.pvl.nis.edu.kz",
    label: "Павлодар ХБН",
  },
  data() {
    return {
      v$: useValidate(),
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
  validations() {
    return {
      user: {
        login: {
          required: helpers.withMessage(
            "Значение не может быть пустым",
            required
          ),
          minLength: helpers.withMessage("Неверный формат", minLength(12)),
          maxLength: helpers.withMessage("Неверный формат", maxLength(12)),
          numeric: helpers.withMessage("Неверный формат", numeric),
        },
        password: {
          required: helpers.withMessage(
            "Значение не может быть пустым",
            required
          ),
          minLength: helpers.withMessage("Неверный формат", minLength(6)),
        },
      },
    };
  },
  methods: {
    ...mapActions(["toggleTheme", "login", "setCity"]),
    async updateCaptcha() {
      this.captcha = await refreshCaptcha();
    },
    async submit() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.loading = true;
        this.setCity(this.city);
        try {
          await this.login(this.user);
          this.$router.push({ name: "_dashboard" });
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
    this.city = this.savedCity || this.$options.defaultCity;
  },
};
</script>
