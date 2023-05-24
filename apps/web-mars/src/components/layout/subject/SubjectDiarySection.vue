<template>
  <div
    class="rounded p-2 dark:bg-secondary-darker bg-white shadow-md flex flex-col space-y-2"
  >
    <div
      class="flex space-x-1 items-baseline text-secondary dark:text-secondary-lighter justify-between"
    >
      <span class="font-medium">
        {{ LABEL_TYPES[type] }}
      </span>
      <span class="font-normal text-xs">
        {{ sectionsScore }}/{{ sectionsMaxScore }} - {{ sectionsPercent }}%
      </span>
    </div>
    <div
      v-for="(section, idx) in data"
      :key="section.Name"
      class="flex flex-row justify-between items-start space-x-2"
    >
      <span class="w-4/5 justify-start">{{ section.Name }}</span>
      <div class="w-auto justify-end">
        <div class="w-full flex items-start justify-evenly text-center">
          <div class="w-4.7">
            <template v-if="subjectStore.GM">
              <ScrollPicker
                v-model="section.Score"
                :options="createArray({ length: section.MaxScore + 1 })"
              />
            </template>
            <template v-else>
              {{ section.Score === -1 ? "-" : section.Score }}
            </template>
          </div>
          <div class="w-2">/</div>
          <div class="w-4.7">
            <template
              v-if="
                subjectStore.GM &&
                subjectStore.subject.originalSections[type][idx].MaxScore === 0
              "
            >
              <scroll-picker
                v-model="section.MaxScore"
                :options="createArray({ length: 70 })"
              />
            </template>
            <template v-else>
              {{ section.MaxScore === 0 ? "-" : section.MaxScore }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { getSectionsScores, formatPercent } from "../../../utils"
import ScrollPicker from "../ScrollPicker.vue"
import useSubjectStore from "../../../stores/subject"

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

const LABEL_TYPES = {
  SAU: "СОР",
  SAT: "СОЧ",
}

const subjectStore = useSubjectStore()

const createArray = ({ length }) => Array.from({ length }, (_, i) => i)

const sectionsScore = computed(() => {
  const { score } = getSectionsScores(props.data)
  return score
})
const sectionsMaxScore = computed(() => {
  const { max } = getSectionsScores(props.data)
  return max
})
const sectionsPercent = computed(() => {
  return formatPercent((sectionsScore.value / sectionsMaxScore.value) * 100)
})
</script>
