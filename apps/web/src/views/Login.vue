<template>
  <div
    class="sm:from-transparent sm:to-transparent bg-gradient-to-r bg-conic-to-l from-sky-400 to-primary"
  >
    <div class="grid place-items-center h-[100svh] h-screen">
      <main
        class="sm:m-auto mt-auto sm:h-auto h-[95%] sm:w-96 w-full grid gap-12 grid-cols-1 h-full h-full rounded-t-xl sm:rounded-md shadow-sm bg-white dark:bg-secondary-darker p-4"
      >
        <div class="grid gap-6 grid-cols-1 self-center">
          <header class="flex flex-col space-y-4 items-start">
            <Logo class="w-16 h-16 flex-none" />
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
            <Input
              v-model="form.login"
              type="number"
              autocomplete="username"
              autofocus
              label="Ваш ИИН"
              mask="############"
              :valid="!status.login.isError"
            />
            <Input
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
                <Image
                  class="object-contain w-44 h-12 cursor-pointer select-none duration-150 hover:opacity-50"
                  alt="captcha"
                  :src="`data:image/png;base64,${captcha}`"
                  @click="authStore.updateCaptcha"
                />
                <div>
                  <Input
                    v-model="form.captchaInput"
                    type="text"
                    label="Каптча"
                  />
                </div>
              </div>
            </transition>
            <Select
              v-model="settings.school"
              :loading="
                loaderStore.isLoading && loaderStore.loadingEndpoint === 'CITY'
              "
              :options="schools"
              required
            >
              <template #default>Выберите школу</template>
              <template #loading>Поиск школы...</template>
            </Select>
            <Checkbox
              label="Запомнить меня"
              id="rememberMe"
              v-model="settings.rememberMe"
            />
            <Button type="submit" rounded w-full color="primary">
              Войти
            </Button>
          </form>
        </div>
        <footer class="self-end">
          <div class="flex justify-between items-center">
            <ThemeToggler />
            <Button icon tag="a" :href="TG_LINK" aria-label="Telegram Link">
              <Icon icon="akar-icons:telegram-fill" />
            </Button>
            <Button icon tag="a" :href="GH_LINK" aria-label="GitHub Link">
              <Icon icon="akar-icons:github-fill" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useForm } from "slimeform"
import { GH_LINK, TG_LINK, schools } from "../config"
import { isRequired, getRandomItem } from "../utils"
import useLoaderStore from "../stores/loader"
import useSettingsStore from "../stores/settings"
import useHealthStore from "../stores/health"
import useAuthStore from "../stores/auth"
import Button from "../components/base/Button.vue"
import Input from "../components/base/Input.vue"
import Image from "../components/base/Image.vue"
import Icon from "../components/base/Icon.vue"
import Select from "../components/base/Select.vue"
import Checkbox from "../components/base/Checkbox.vue"
import ThemeToggler from "../components/layout/ThemeToggler.vue"
import Logo from "../components/base/app/Logo.vue"

const emojis =
  "🤔🤐🙃🤤🧐👴😭💩🍕⚡🆗🤙🗿🎪👻🎃🌍👌👊💪👺🙈🙉🙊🐰🐔🐍😡🔥🤡🌈💛💙💜💚💓"

const randomEmoji = getRandomItem([...emojis])

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const settingsStore = useSettingsStore()
const { checkAvailability } = useHealthStore()

const { captcha } = storeToRefs(authStore)
const { settings } = storeToRefs(settingsStore)

settingsStore.predictSchool()

watch(
  () => settingsStore.settings.school,
  async () => {
    await authStore.updateCaptcha()
  }
)

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
})

const submit = async () => {
  try {
    await authStore.login({
      login: form.login,
      password: form.password,
      captchaInput: form.captchaInput,
    })
  } catch (error) {
    if (error.response?.data?.data?.base64img) {
      captcha.value = error.response.data.data.base64img
      form.captchaInput = ""
    }
    await checkAvailability()
  }
}

onMounted(() => {
  if (settingsStore.settings.school) {
    authStore.updateCaptcha()
  }
})
</script>
