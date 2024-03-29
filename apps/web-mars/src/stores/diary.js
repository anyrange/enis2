import { computed } from "vue"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { getDiary } from "../api"
import { findIndex, findItem } from "../utils"
import useSettingsStore from "./settings.js"
import useTermsStore from "./terms.js"
import useAuthStore from "./auth.js"

export default defineStore("diary", () => {
  const settingsStore = useSettingsStore()

  const authStore = useAuthStore()
  const termsStore = useTermsStore()

  const diaryData = useStorage("diaryData", [])

  const matchedDiary = computed(() => {
    return findItem(diaryData.value, {
      yearName: settingsStore.settings.year,
      termName: settingsStore.settings.tab,
    })
  })

  const currentDiary = computed(() => {
    return findIndex(diaryData.value, {
      yearName: settingsStore.settings.year,
      termName: settingsStore.settings.tab,
    })
  })

  const diary = computed(() => {
    const rawDiary = matchedDiary.value ? matchedDiary.value.diary : []

    const sort = {
      name: (array) => array.sort((a, b) => a.Name.localeCompare(b.Name)),
      score: (array) => array.sort((a, b) => b.Score - a.Score),
    }

    const sortedDiary = sort[settingsStore.settings.sortBy](rawDiary)

    const filteredDiary = sortedDiary.filter((o) => o.Score !== 0)
    const allEmpty = !filteredDiary.length

    return settingsStore.settings.hideEmpty
      ? allEmpty
        ? sortedDiary
        : filteredDiary
      : sortedDiary
  })

  const clearDiary = () => {
    diaryData.value = []
  }

  const fetchDiary = async (force = false) => {
    const termId = termsStore.currentTermId

    const termName = settingsStore.settings.tab
    const yearName = settingsStore.settings.year

    const { index, exists } = findIndex(diaryData.value, {
      termName,
      yearName,
    })

    if (exists && !force) return

    try {
      const { data, token } = await getDiary(termId)
      authStore.setToken(token)
      if (exists) {
        diaryData.value[index].diary = data
      } else {
        const diaryObject = {
          diary: data,
          termName,
          yearName,
        }
        diaryData.value = [...diaryData.value, diaryObject]
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    diaryData,
    diary,
    currentDiary,
    fetchDiary,
    clearDiary,
  }
})
