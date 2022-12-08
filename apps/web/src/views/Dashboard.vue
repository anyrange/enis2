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
          v-for="({ Id, Name }, index) in termsStore.terms"
          :key="`${index}-${Id}`"
          :name="Name"
        >
          {{ GREEK_NUMERALS[index + 1] }}
        </Tab>
        <Tab name="grades">
          <Icon icon="material-symbols:school-outline-rounded" />
        </Tab>
      </div>
    </Tabs>
  </nav>
  <nav class="dashboard-container" v-if="yearsStore.years && settings.year">
    <Carousel
      class="w-full mx-4 my-3.5 z-20"
      :items-to-show="3"
      v-model="yearIndex"
    >
      <Slide v-for="(year, index) in yearsStore.years" :key="index">
        <button
          class="text-secondary-lighter font-medium default-focus appearance-none"
          :class="{
            '!text-primary': settings.year === year.label,
          }"
          @click="settings.year = year.label"
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
          v-for="item in gradesStore.grades"
          :key="item"
          :subject="item"
        />
      </template>
      <template v-else>
        <SubjectDiary
          v-for="(item, index) in diaryStore.diary"
          :key="item.Name || index"
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
import { watchOnce } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { notify } from "../services/notify.js"
import { getRandomItem } from "../utils"
import useLoaderStore from "../stores/loader"
import useSubjectStore from "../stores/subject"
import useSettingsStore from "../stores/settings"
import useYearsStore from "../stores/years"
import useAuthStore from "../stores/auth"
import useHealthStore from "../stores/health"
import useDiaryStore from "../stores/diary"
import useTermsStore from "../stores/terms"
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
const yearsStore = useYearsStore()
const termsStore = useTermsStore()
const diaryStore = useDiaryStore()
const gradesStore = useGradesStore()
const { checkAvailability } = useHealthStore()
const { login, logout } = useAuthStore()

const { settings } = storeToRefs(settingsStore)

const actualYearIndex = yearsStore.years.indexOf(
  (item) => item.label === yearsStore.actualYearName
)
const yearIndex = ref(actualYearIndex - 2)

const isGrades = computed(() => settings.value.tab === "grades")
const isEmptyContent = computed(() =>
  isGrades.value ? !gradesStore.grades.length : !diaryStore.diary.length
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

const fetchTabs = async (force) => {
  try {
    await yearsStore.fetchYears(force)
    await termsStore.fetchTerms(force)
  } catch (error) {
    return Promise.reject(error)
  }
}

const fetchContent = async (force) => {
  try {
    isGrades.value
      ? await gradesStore.fetchGrades(force)
      : await diaryStore.fetchDiary(force)
  } catch (error) {
    return Promise.reject(error)
  }
}

const fetchData = async ({ force = false, includeTabs = false }) => {
  try {
    includeTabs && (await fetchTabs(force))
    await fetchContent(force)
  } catch (error) {
    return Promise.reject(error)
  }
}

const getData = async ({ force = false, includeTabs = false }) => {
  try {
    await fetchData({ force, includeTabs })
  } catch (error) {
    const isUnauthorized = error.response.status === 401

    const handleError = () => {
      isUnauthorized
        ? endSession()
        : showError("Произошла ошибка, попробуйте войти в СУШ")
    }
    if (settings.value.rememberMe) {
      try {
        await login({})
        await fetchData({ force: true, includeTabs: true })
        return
      } catch {
        handleError()
      }
    } else {
      handleError()
    }
    await checkAvailability()
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
    await getData({ includeTabs: true, force: true })
    const lastSubject = diaryStore.diary.find((s) => {
      return s.Name === selectedSubject.Name
    })
    await subjectStore.fetchSubject(lastSubject)
  }
}

watch(
  [() => settings.value.year, () => settings.value.tab],
  async ([newY, newT], [oldY, oldT]) => {
    const changedYear = oldY && newY && newY !== oldY
    const changedTab = oldT && newT && newT !== oldT

    if (changedYear) {
      return getData({ includeTabs: true })
    }
    if (changedTab) {
      return getData({ includeTabs: false })
    }
  },
  {
    immediate: true,
  }
)

// force-fetch if initial tab is 'grades' was changed to 'diary' or vice versa
watchOnce(
  () => settings.value.tab,
  (newTab, oldTab) => {
    if (newTab === "grades" || oldTab === "grades") {
      return getData({ includeTabs: true, force: true })
    }
  }
)

getData({ includeTabs: true, force: true })
</script>
