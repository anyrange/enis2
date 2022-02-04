<template>
  <header class="w-full sticky inset-x-0 top-0 left-0">
    <tabs v-model="settings.year" class="tabs-bg">
      <div class="tabs-container">
        <tab v-for="{ value, label } in years" :key="value" :name="label">
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
        <tab v-for="({ Id, Name }, index) in terms" :key="Id" :name="Name">
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
      <random-emoticon v-if="!loading && isEmptyContent" class="m-auto" />
      <template v-if="isGrades">
        <subject-grades v-for="item in grades" :key="item" :subject="item" />
      </template>
      <template v-else>
        <subject-diary
          v-for="item in diary"
          :key="item"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { notify } from "@/services/notify.js";
import SettingsModal from "@/views/modals/SettingsModal.vue";
import SubjectModal from "@/views/modals/SubjectModal.vue";
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

const GREEK_NUMERALS = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

const REFETCH_ATTEMPTS = 1;

const refetchAttempts = ref(0);
const showSubjectModal = ref(false);
const showSettingsModal = ref(false);
const showYears = ref(true);
const scrollPosition = ref(0);
const scrollOffset = ref(40);

const loaderStore = useLoader();
const subjectStore = useSubject();
const settingsStore = useSettings();
const yearsStore = useYears();
const termsStore = useTerms();
const diaryStore = useDiary();
const gradesStore = useGrades();
const { checkAvailability } = useHealth();
const { login, logout } = useAuth();

const { loading, errorMessage } = storeToRefs(loaderStore);
const { settings } = storeToRefs(settingsStore);
const { subject } = storeToRefs(subjectStore);
const { years, actualYearName, currentYearId } = storeToRefs(yearsStore);
const { terms, actualTermName, currentTermId } = storeToRefs(termsStore);
const { diary } = storeToRefs(diaryStore);
const { grades } = storeToRefs(gradesStore);

const isGrades = computed(() => settings.value.tab === "grades");
const isEmptyContent = computed(() =>
  isGrades.value ? !grades.value.length : !diary.value.length
);

const handleScroll = () => {
  scrollPosition.value = window.pageYOffset;
  showYears.value = scrollPosition.value <= scrollOffset.value;
};

onMounted(() => {
  scrollPosition.value = window.pageYOffset;
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const endSession = () => {
  logout();
  notify.show({
    type: "danger",
    message: errorMessage.value || "Сессия завершена",
  });
};

const startSession = async ({ forceUpdate }) => {
  try {
    await getTermsAndContentByYear({ forceUpdate });
    refetchAttempts.value = 0;
  } catch (error) {
    return Promise.reject(error);
  }
};

const restoreSession = async () => {
  refetchAttempts.value++;
  if (refetchAttempts.value >= REFETCH_ATTEMPTS) {
    endSession();
    return Promise.reject();
  }
  try {
    settings.value.rememberMe && (await login({}));
    await startSession({ forceUpdate: true });
  } catch {
    await checkAvailability();
    return Promise.reject();
  }
};

const getTabs = async ({ forceUpdate }) => {
  try {
    await yearsStore.fetchYears({ force: forceUpdate });
    settings.value.year = settings.value.year || actualYearName.value;
    await termsStore.fetchTerms({
      force: forceUpdate,
      yearId: currentYearId.value,
      yearName: settings.value.year,
    });
    settings.value.tab = settings.value.tab || actualTermName.value;
  } catch (error) {
    try {
      await restoreSession();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const getContent = async ({ forceUpdate }) => {
  try {
    isGrades.value
      ? await gradesStore.fetchGrades({
          yearId: currentYearId.value,
          yearName: settings.value.year,
          force: forceUpdate,
        })
      : await diaryStore.fetchDiary({
          termId: currentTermId.value,
          termName: settings.value.tab,
          yearName: settings.value.year,
          force: forceUpdate,
        });
  } catch (error) {
    try {
      await restoreSession();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const getTermsAndContentByYear = async ({ forceUpdate }) => {
  try {
    await getTabs({ forceUpdate });
    await getContent({ forceUpdate });
  } catch (error) {
    return Promise.reject(error);
  }
};

const openSubjectModal = async (selectedSubject) => {
  if (
    selectedSubject.Name === subject.value.originalSubject.Name &&
    showSubjectModal.value
  ) {
    return;
  }
  subjectStore.clearSubject();
  showSubjectModal.value = true;
  try {
    await subjectStore.fetchSubject(selectedSubject);
  } catch (error) {
    await restoreSession();
    const lastSubject = diary.value.find(
      (s) => s.Name === selectedSubject.Name
    );
    await subjectStore.fetchSubject(lastSubject);
  }
};

watch(
  [() => settings.value.year, () => settings.value.tab],
  async ([newYearName, newTab], [oldYearName, oldTab]) => {
    if (
      (!newYearName && !oldYearName && !newTab && !oldTab) ||
      (newYearName && newTab && !oldYearName && !oldTab)
    ) {
      await startSession({ forceUpdate: false });
    }
    if (oldYearName && newYearName && newYearName !== oldYearName) {
      await getTermsAndContentByYear({ forceUpdate: false });
    }
    if (oldTab && newTab && newTab !== oldTab) {
      await getContent({ forceUpdate: false });
    }
  },
  {
    immediate: true,
  }
);
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
