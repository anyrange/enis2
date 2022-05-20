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
    <tabs v-model="settings.tab">
      <div class="dashboard-container">
        <tab
          v-for="({ Id, Name }, index) in termsStore.terms"
          :key="Id"
          :name="Name"
        >
          {{ GREEK_NUMERALS[index + 1] }}
        </tab>
        <tab name="grades">
          <icon icon="material-symbols:school-outline-rounded" />
        </tab>
      </div>
    </tabs>
  </nav>

  <nav class="dashboard-container" v-if="yearsStore.years && settings.year">
    <carousel
      class="w-full mx-4 my-3.5 z-20"
      :items-to-show="3"
      v-model="yearIndex"
    >
      <slide v-for="(year, index) in yearsStore.years" :key="index">
        <button
          class="text-secondary-lighter font-medium default-focus appearance-none"
          :class="{
            '!text-primary': settings.year === year.label,
          }"
          @click="settings.year = year.label"
        >
          {{ year.label }}
        </button>
      </slide>
      <template #addons="{ slidesCount }">
        <navigation v-if="slidesCount > 3" />
      </template>
    </carousel>
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
        <span class="text-5xl font-normal leading-7">{{ randomEmoticon }}</span>
      </div>
      <template v-if="isGrades">
        <subject-grades
          v-for="item in gradesStore.grades"
          :key="item"
          :subject="item"
        />
      </template>
      <template v-else>
        <subject-diary
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
      <base-button
        v-if="!settings.rememberMe"
        round
        color="negative"
        @click="logout()"
      >
        Выйти
      </base-button>
    </div>
    <div class="dashboard-container justify-end">
      <base-button icon @click="showSettingsModal = true" class="mr-2">
        <icon icon="clarity:settings-solid" />
      </base-button>
    </div>
  </footer>
  <modal :show="showSubjectModal" @close="showSubjectModal = false">
    <subject-modal />
  </modal>
  <modal :show="showSettingsModal" @close="showSettingsModal = false">
    <settings-modal />
  </modal>
</template>

<style>
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
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { storeToRefs } from "pinia";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { notify } from "@/services/notify.js";
import {
  useSettings,
  useAuth,
  useYears,
  useHealth,
  useLoader,
  useSubject,
  useDiary,
  useTerms,
  useGrades,
} from "@/store";
import useRandom from "@/composables/useRandom";

const GREEK_NUMERALS = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

const wrapper = inject("wrapper");

const showSubjectModal = ref(false);
const showSettingsModal = ref(false);
const showYears = ref(true);
const scrollPosition = ref(0);
const scrollOffset = ref(40);

const { randomEmoticon } = useRandom();

const loaderStore = useLoader();
const subjectStore = useSubject();
const settingsStore = useSettings();
const yearsStore = useYears();
const termsStore = useTerms();
const diaryStore = useDiary();
const gradesStore = useGrades();
const { checkAvailability } = useHealth();
const { login, logout } = useAuth();

const { settings } = storeToRefs(settingsStore);

const actualYearIndex = yearsStore.years.indexOf(
  (item) => item.label === yearsStore.actualYearName
);
const yearIndex = ref(actualYearIndex - 2);

const isGrades = computed(() => settings.value.tab === "grades");
const isEmptyContent = computed(() =>
  isGrades.value ? !gradesStore.grades.length : !diaryStore.diary.length
);

const handleScroll = () => {
  scrollPosition.value = wrapper.value.scrollTop;
  showYears.value = scrollPosition.value <= scrollOffset.value;
};

onMounted(() => {
  scrollPosition.value = wrapper.value.scrollTop;
  wrapper.value.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  wrapper.value.removeEventListener("scroll", handleScroll);
});

const showError = (message) => {
  notify.show({
    type: "danger",
    message,
  });
};

const endSession = (message = "Сессия завершена") => {
  logout();
  showError(message);
};

const fetchTabs = async (force) => {
  try {
    await yearsStore.fetchYears(force);
    await termsStore.fetchTerms(force);
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchContent = async (force) => {
  try {
    isGrades.value
      ? await gradesStore.fetchGrades(force)
      : await diaryStore.fetchDiary(force);
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchData = async ({ force = false, includeTabs = false }) => {
  try {
    includeTabs && (await fetchTabs(force));
    await fetchContent(force);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getData = async ({ force = false, includeTabs = false }) => {
  try {
    await fetchData({ force, includeTabs });
  } catch (error) {
    const isUnauthorized = error.response.status === 401;
    const message = error.response.data.message;
    const handleError = () => {
      isUnauthorized ? endSession() : showError(message);
    };
    if (settings.value.rememberMe) {
      try {
        await login();
        await fetchData({ force: true, includeTabs: true });
        return;
      } catch {
        handleError();
      }
    } else {
      handleError();
    }
    await checkAvailability();
  }
};

const openSubjectModal = async (selectedSubject) => {
  if (
    showSubjectModal.value &&
    selectedSubject.Name === subjectStore.subject.originalSubject.Name
  ) {
    return;
  }
  subjectStore.clearSubject();
  showSubjectModal.value = true;
  try {
    await subjectStore.fetchSubject(selectedSubject);
  } catch (error) {
    await getData({ includeTabs: true, force: true });
    const lastSubject = diaryStore.diary.find((s) => {
      return s.Name === selectedSubject.Name;
    });
    await subjectStore.fetchSubject(lastSubject);
  }
};

watch(
  [() => settings.value.year, () => settings.value.tab],
  async ([newY, newT], [oldY, oldT]) => {
    const changedYear = oldY && newY && newY !== oldY;
    const changedTab = oldT && newT && newT !== oldT;

    if (changedYear) {
      return getData({ includeTabs: true });
    }
    if (changedTab) {
      return getData({ includeTabs: false });
    }
  },
  {
    immediate: true,
  }
);

getData({ includeTabs: true, force: true });
</script>
