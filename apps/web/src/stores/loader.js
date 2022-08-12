import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { ENDPOINTS } from "../config"
import useGrades from "./grades.js"
import useDiary from "./diary.js"

export default defineStore("loader", () => {
  const gradesStore = useGrades()
  const diaryStore = useDiary()

  const existsContent = computed(() => {
    return diaryStore.currentDiary.exists || gradesStore.currentGrade.exists
  })

  const loadingQueue = ref([])
  const errors = ref([])

  const isLoading = computed(() => loadingQueue.value.length > 0)
  const loadingEndpoint = computed(() => {
    const endpoint = loadingQueue.value[loadingQueue.value.length - 1]
    return ENDPOINTS[endpoint?.key] ?? null
  })

  const overlay = computed(() => {
    const mode = {
      show: loadingQueue.value.some((item) => {
        return ENDPOINTS[item.key]?.overlay === "show"
      }),
      hide: loadingEndpoint.value?.overlay === "hide",
      optional: !existsContent.value,
    }
    return {
      active: isLoading.value && !mode.hide,
      blocking: isLoading.value && (mode.show || mode.optional),
    }
  })

  return {
    loadingQueue,
    errors,
    loadingEndpoint,
    isLoading,
    overlay,
  }
})
