import { computed } from "vue"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { getDiary } from "../api"
import useSettingsStore from "./settings.js"

export default defineStore("diary", () => {
  const settingsStore = useSettingsStore()

  const diaryData = useStorage("diaryData", {})

  const diary = computed(() => {
    const yearId = settingsStore.settings.year
    return diaryData.value[yearId] || [[],[],[],[]]
  })

  const formatDiary = (diary) => diary.map(subject => ({
    Mark: subject.mark,
    Name: subject.name.ru,
    Id: subject.id,
    Score: subject.currScore
  }))

  const currentDiary = computed(() => {
    const chosenTerm = settingsStore.settings.tab !== 'grades'
        ? settingsStore.settings.tab
        : Number(settingsStore.settings.tab)
  
    return formatDiary(diary.value[chosenTerm]?.subjects || [])
  })

  const fetchDiary = async (force = false) => {
    const yearId = settingsStore.settings.year

    const exists = diaryData.value[yearId]

    if (exists && !force) return

    try {
      const data = await getDiary(yearId)
      diaryData.value[yearId] = data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const clearDiary = () => {
    diaryData.value = {}
  }

  return {
    diary,
    currentDiary,
    fetchDiary,
    clearDiary,
  }
})
