import { computed } from "vue"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { DEFAULT_RANGES } from "../config"

export default defineStore("settings", () => {
  const initialState = {
    tab: "",
    year: "",
    theme: "dark",
    rememberMe: false,
    sortBy: "score",
    hideEmpty: false,
  }
  const settings = useStorage("settings", { ...initialState })
  const ranges = useStorage("customRanges", [...DEFAULT_RANGES])

  const darkTheme = computed({
    get: () => settings.value.theme === "dark",
    set: (value) => {
      settings.value.theme = value ? "dark" : "light"
    },
  })

  const clearSettings = () => {
    Object.assign(
      settings.value,
      // eslint-disable-next-line no-unused-vars
      (({ theme, ...o }) => o)(initialState)
    )
  }

  const toggleTheme = () => {
    settings.value.theme = settings.value.theme === "light" ? "dark" : "light"
  }

  return {
    toggleTheme,
    clearSettings,
    settings,
    darkTheme,
    ranges,
  }
})
