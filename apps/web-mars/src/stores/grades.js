import { computed } from "vue"
import { useStorage } from "@vueuse/core"
import { defineStore, storeToRefs } from "pinia"
import { getGrades } from "../api"
import useSettingsStore from "./settings.js"

export default defineStore("grades", () => {
  const settingsStore = useSettingsStore()
  const { settings } = storeToRefs(settingsStore)
  
  const gradesData = useStorage("gradesData", [])

  const filteredGrades = computed(() => {
    const rawGrades = gradesData.value || []
    return rawGrades.filter(({ reportCard }) => reportCard.length)
  })

  const years = computed(() => {
    return filteredGrades.value
      .map(({ schoolYear }) => ({ id: schoolYear.id, label: schoolYear.name.ru }))
  })

  const currentGrades = computed(() => {
    const chosenYear = filteredGrades.value
      .find(({ schoolYear }) => schoolYear.id === settings.value.year)

    return chosenYear ? chosenYear.reportCard : []
  })

  const clearGrades = () => {
    gradesData.value = []
  }

  const yearlyMarks = computed(() => {
    return currentGrades.value
      .reduce((terms, subject) => {
        const label = subject.subject.name.ru
        
        const pushIf = (index, mark) => {
          mark && terms[index].push({ label, mark: mark.ru})
        }

        pushIf(0, subject.firstPeriod)
        pushIf(1, subject.secondPeriod)
        pushIf(2, subject.thirdPeriod)
        pushIf(3, subject.fourthPeriod)

        pushIf(1, subject.firstHalfYearMark)
        pushIf(3, subject.secondHalfYearMark)
        
        pushIf(4, subject.yearMark)

        return terms
      }, [[], [], [], [], []]);
  })
  
  const fetchGrades = async (force = false) => {
    if (gradesData.value && !force) return

    try {
      gradesData.value = await getGrades()

      if(!settings.value.year)
        settings.value.year = filteredGrades.value.find(({ schoolYear }) => schoolYear.isCurrent)?.schoolYear.id
          || filteredGrades.value[filteredGrades.value.length - 1].schoolYear.id

      if (!settings.value.tab) {
        const lastInfoTab = yearlyMarks.value.map(arr => !!arr.length).lastIndexOf(true)

        if (lastInfoTab === 4) {
          settings.value.tab = 'grades'
        } else {
          settings.value.tab = lastInfoTab !== -1 ? `${lastInfoTab}` : "0"
        }
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }


  return {
    gradesData,
    years,
    currentGrades,
    fetchGrades,
    clearGrades,
  }
})