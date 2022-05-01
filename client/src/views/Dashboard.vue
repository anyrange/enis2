<template>
  <header class="w-full sticky inset-x-0 top-0 left-0">
    <tabs v-model="settings.year" class="tabs-bg">
      <div class="tabs-container">
        <tab
          v-for="{ value, label } in yearsStore.years"
          :key="value"
          :name="label"
        >
          {{ label }}
        </tab>
      </div>
    </tabs>
    <tabs
      v-model="settings.tab"
      class="floating-nav tabs-bg"
      :class="{ 'is-hidden': !showYears }"
    >
      <div class="tabs-container">
        <tab
          v-for="({ Id, Name }, index) in termsStore.terms"
          :key="Id"
          :name="Name"
        >
          {{ GREEK_NUMERALS[index + 1] }}
        </tab>
        <tab name="grades">
          <grades-icon />
        </tab>
      </div>
    </tabs>
  </header>
  <main class="flex justify-center p-3">
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
        rounded
        color="negative"
        @click="logout()"
      >
        Выйти
      </base-button>
    </div>
    <div
      class="absolute bottom-4 right-4 rounded-full bg-gray-50 dark:bg-gray-900-spotify"
    >
      <base-button
        flat
        icon
        aria-label="Open Settings"
        @click="showSettingsModal = true"
      >
        <settings-icon />
      </base-button>
    </div>
  </footer>
  <subject-modal :show="showSubjectModal" @close="showSubjectModal = false" />
  <settings-modal
    :show="showSettingsModal"
    @close="showSettingsModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { storeToRefs } from "pinia";
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

<style>
.tabs-bg {
  @apply bg-white dark:bg-gray-800-spotify;
}
.tabs-container {
  @apply flex w-full xl:w-1/2 m-auto;
}
.floating-nav {
  transform: translate3d(0, 0, 0);
  @apply transition transition-transform duration-300;
}
.floating-nav.is-hidden {
  transform: translate3d(0, -100%, 0);
}
.settings-label {
  @apply sm:text-base text-sm text-gray-700 dark:text-gray-500-spotify;
}
.settings-link {
  @apply sm:text-base text-sm text-gray-700 dark:text-gray-500-spotify hover:underline;
}
</style>
