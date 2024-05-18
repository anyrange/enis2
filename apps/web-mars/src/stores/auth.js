import { ref } from "vue"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { login as _login, refreshTokens as _refreshTokens } from "../api"
import { notify } from "../services/notify.js"
import useDiaryStore from "./diary.js"
import useSettingsStore from "./settings.js"
import useSubjectStore from "./subject.js"

export default defineStore("auth", () => {
  const { clearDiary } = useDiaryStore()
  const { clearSettings } = useSettingsStore()
  const { clearSubject } = useSubjectStore()

  const token = useStorage("token", "")
  const refreshToken = useStorage("refreshToken", "")
  const authenticated = useStorage("authenticated", false)

  const clearStore = () => {
    clearDiary()
    clearSettings()
    clearSubject()
  }

  const setToken = (newToken, newRefreshToken) => {
    token.value = newToken
    refreshToken.value = newRefreshToken
  }

  const logout = () => {
    token.value = null
    refreshToken.value = null
    authenticated.value = false
    clearStore()
  }

  
  const login = async (credentials) => {
    try {
      const data = await _login(credentials)
      setToken(data.accessToken, data.refreshToken)
      authenticated.value = true
    } catch (error) {
      console.log('a', error)
      logout()
      notify.show({
        type: "danger",
        message: "Произошла ошибка, попробуйте войти в СУШ",
      })
      return Promise.reject(error)
    }
  }

  const refreshSession = async () => {
    try {
      const data = await _refreshTokens(refreshToken.value)
      setToken(data.accessToken, data.refreshToken)
      authenticated.value = true
    } catch (error) {
      logout()
      notify.show({
        type: "danger",
        message: "Произошла ошибка, попробуйте войти в СУШ",
      })
      return Promise.reject(error)
    }
  }

  return {
    token,
    refreshToken,
    authenticated,
    login,
    refreshSession,
    logout,
    setToken,
  }
})
