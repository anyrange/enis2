<template>
  <header class="header-background">
    <div class="dashboard-container px-4 py-3.5">
      <h1 class="text-left text-xl font-medium dark:text-secondary-lighter">
        enis2
      </h1>
    </div>
  </header>
  <nav
    class="header-background w-full sticky top-0 shadow-sm z-30 border-b-2 dark:border-secondary-dark/50"
  >
    <Tabs v-model="settings.tab">
      <div class="dashboard-container">
        <Tab
          v-for="(prikol, index) in diaryStore.diary"
          :key="index"
          :name="`${index}`"
        >
          {{ GREEK_NUMERALS[index + 1] }}
        </Tab>
        <Tab name="grades">
          <Icon icon="material-symbols:school-outline-rounded" />
        </Tab>
      </div>
    </Tabs>
  </nav>
  <nav class="dashboard-container" v-if="years && settings.year">
    <Carousel
      class="w-full mx-4 my-3.5 z-20"
      :items-to-show="3"
      v-model="yearIndex"
    >
      <Slide v-for="(year, index) in years" :key="index">
        <button
          class="text-secondary-lighter font-medium default-focus appearance-none"
          :class="{
            '!text-primary': settings.year === year.id,
          }"
          @click="settings.year = year.id"
        >
          {{ year.label }}
        </button>
      </Slide>
      <template #addons="{ slidesCount }">
        <Navigation v-if="slidesCount > 3" />
      </template>
    </Carousel>
  </nav>
  <main class="flex justify-center px-3">
    <section
      class="flex flex-col space-y-3 mb-6 w-full sm:w-450px"
      :class="{ 'h-80vh': isEmptyContent }"
    >
      <div
        v-if="!loaderStore.isLoading && isEmptyContent"
        class="m-auto h-full flex flex-col items-center justify-center"
      >
        <span class="text-5xl font-normal leading-7">
          {{ getRandomItem(emoticons) }}
        </span>
      </div>
      <template v-if="isGrades">
        <SubjectGrades
          v-for="item in gradesStore.currentGrades"
          :key="item"
          :subject="item"
        />
      </template>
      <template v-else>
        <SubjectDiary
          v-for="(item, index) in diaryStore.currentDiary"
          :key="item.label || index"
          :subject="item"
          @click="openSubjectModal(item)"
        />
      </template>
    </section>
  </main>
  <footer class="fixed bottom-0 left-0 right-0 left-0" style="height: 50px">
    <div
      class="absolute bottom-4"
      style="left: 50%; transform: translateX(-50%)"
    >
      <Button
        v-if="!settings.rememberMe"
        round
        color="negative"
        @click="logout()"
      >
        Выйти
      </Button>
    </div>
    <div class="dashboard-container justify-end">
      <Button icon @click="showSettingsModal = true" class="mr-2">
        <Icon icon="clarity:settings-solid" />
      </Button>
    </div>
  </footer>
  <Modal :show="showSubjectModal" @close="showSubjectModal = false">
    <SubjectContainer />
  </Modal>
  <Modal :show="showSettingsModal" @close="showSettingsModal = false">
    <SettingsContainer />
  </Modal>
</template>

<style>
@import "vue3-carousel/dist/carousel.css";

.carousel__prev,
.carousel__next {
  @apply bg-transparent text-secondary-lighter mx-1 default-focus;
}
.header-background {
  @apply bg-white dark:bg-secondary-darker;
}
.dashboard-container {
  @apply flex w-full xl:w-1/2 m-auto;
}
</style>

<script setup>
import { ref, computed, watch } from "vue"
import { Carousel, Slide, Navigation } from "vue3-carousel"
import { storeToRefs } from "pinia"
import { notify } from "../services/notify.js"
import { getRandomItem } from "../utils"
import useLoaderStore from "../stores/loader"
import useSubjectStore from "../stores/subject"
import useSettingsStore from "../stores/settings"
import useAuthStore from "../stores/auth"
import useDiaryStore from "../stores/diary"
import useGradesStore from "../stores/grades"
import Button from "../components/base/Button.vue"
import Icon from "../components/base/Icon.vue"
import Modal from "../components/base/Modal.vue"
import Tabs from "../components/base/tabs/Tabs.vue"
import Tab from "../components/base/tabs/Tab.vue"
import SubjectDiary from "../components/layout/subject/SubjectDiary.vue"
import SubjectGrades from "../components/layout/subject/SubjectGrades.vue"
import SubjectContainer from "../components/layout/modal-containers/SubjectContainer.vue"
import SettingsContainer from "../components/layout/modal-containers/settings/SettingsContainer.vue"

const emoticons = [
  "¯\\_(ツ)_/¯",
  "(≥o≤)",
  "(>_<)",
  "\\(^Д^)/",
  "(o^^)o",
  "(^-^*)",
  "(;-;)",
  "(·_·)",
  "(˚Δ˚)b",
  "\\(o_o)/",
  "(·.·)",
]

const GREEK_NUMERALS = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
}

const showSubjectModal = ref(false)
const showSettingsModal = ref(false)

const loaderStore = useLoaderStore()
const subjectStore = useSubjectStore()
const settingsStore = useSettingsStore()
const diaryStore = useDiaryStore()
const gradesStore = useGradesStore()

const { years } = gradesStore
const { refreshSession, logout } = useAuthStore()

const { settings } = storeToRefs(settingsStore)

const isGrades = computed(() => settings.value.tab === "grades")
const isEmptyContent = computed(() =>
  isGrades.value
    ? !gradesStore.currentGrades.length
    : !diaryStore.currentDiary.length
)

const showError = (message) => {
  notify.show({
    type: "danger",
    message,
  })
}

const endSession = (message = "Сессия завершена") => {
  logout()
  showError(message)
}

const actualYearIndex = years.findIndex((item) => {
  return item.id === settings.value.year
})
const yearIndex = ref(actualYearIndex)

const getData = async ({ force = false }) => {
  try {
    await gradesStore.fetchGrades(force)
  } catch (error) {
    const isUnauthorized = error.response && error.response.status === 401
    const handleError = () => {
      isUnauthorized
        ? endSession()
        : showError("Произошла ошибка, попробуйте войти в СУШ")
    }
    if (settings.value.rememberMe && isUnauthorized) {
      try {
        await refreshSession()
        await gradesStore.fetchGrades(true)
      } catch {
        handleError()
      }
    } else {
      handleError()
    }
  }
}

const openSubjectModal = async (selectedSubject) => {
  if (
    showSubjectModal.value &&
    selectedSubject.Name === subjectStore.subject.originalSubject.Name
  ) {
    return
  }
  subjectStore.clearSubject()
  showSubjectModal.value = true
  try {
    await subjectStore.fetchSubject(selectedSubject)
  } catch (error) {
    await getData({ force: true })
    const lastSubject = diaryStore.diary.find((s) => {
      return s.Name === selectedSubject.Name
    })
    await subjectStore.fetchSubject(lastSubject)
  }
}

watch(
  () => settings.value.year,
  async (newY, oldY) => {
    const changedYear = newY !== oldY

    if (changedYear) {
      try {
        await diaryStore.fetchDiary(true)
      } catch (_) {}
    }
  },
  {
    immediate: true,
  }
)

getData({ force: true })
</script>
