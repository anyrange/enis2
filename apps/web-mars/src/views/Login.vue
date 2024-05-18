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
              <h1 class="text-3xl font-semibold">enis2</h1>
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
import { watch } from "vue"
import { storeToRefs } from "pinia"
import { useForm } from "slimeform"
import { GH_LINK, TG_LINK, SCHOOLS } from "../config"
import { isRequired, getRandomItem } from "../utils"
import useLoaderStore from "../stores/loader"
import useSettingsStore from "../stores/settings"
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
const settingsStore = useSettingsStore()

const { settings } = storeToRefs(settingsStore)

const { form, status, onSubmit } = useForm({
  form: () => ({
    login: "",
    password: "",
  }),
  rule: {
    login: [isRequired],
    password: [isRequired],
  },
})

const submit = async () => {
  try {
    await authStore.login({
      username: form.login,
      password: form.password,
    })
  } catch (error) {
    if (error.response?.data?.data?.base64img) {
      form.captchaInput = ""
    }
  }
}
</script>
