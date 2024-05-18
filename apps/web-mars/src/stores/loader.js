import { ref, computed } from "vue"
import { defineStore } from "pinia"
import useGrades from "./grades.js"
import useDiary from "./diary.js"

export default defineStore("loader", () => {
  const gradesStore = useGrades()
  const diaryStore = useDiary()

  const existsContent = computed(() => {
    return !!diaryStore.currentDiary || !!gradesStore.currentGrades
  })

  const loadingQueue = ref([])
  const errors = ref([])

  const isLoading = computed(() => loadingQueue.value.length > 0)

  const overlay = computed(() => {
    const mode = {
      show: isLoading.value,
      hide: false,
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
    isLoading,
    overlay,
  }
})
