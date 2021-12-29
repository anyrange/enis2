<template>
  <header class="w-full sticky inset-x-0 top-0 left-0">
    <tabs v-model="currentYearName" class="tabs-bg">
      <div class="tabs-container">
        <tab
          v-for="year in years.data"
          :key="year.value"
          :name="year.label"
          @selected="getTermsAndContentByYear({ forceUpdate: false })"
        >
          {{ year.label }}
        </tab>
      </div>
    </tabs>
    <tabs
      v-model="currentTab"
      class="floating-nav tabs-bg"
      :class="{ 'is-hidden': !showYears }"
    >
      <div class="tabs-container">
        <tab
          v-for="(term, index) in terms"
          :key="term.Id"
          :name="term.Name"
          @selected="getContent({ forceUpdate: false })"
        >
          {{ GREEK_NUMERALS[index + 1] }}
        </tab>
        <tab name="grades" @selected="getContent({ forceUpdate: false })">
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
        v-if="!rememberMe"
        rounded
        color="negative"
        @click="logout()"
      >
        Выйти
      </base-button>
    </div>
    <div
      class="
        absolute
        bottom-4
        right-4
        rounded-full
        bg-gray-50
        dark:bg-gray-900-spotify
      "
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { notify } from "@/services/notify.js";
import SettingsModal from "@/views/modals/SettingsModal.vue";
import SubjectModal from "@/views/modals/SubjectModal.vue";
import useSettings from "@/composables/useSettings";
import useSubject from "@/composables/useSubject";
import useLoader from "@/composables/useLoader";
import useYears from "@/composables/useYears";
import useTerms from "@/composables/useTerms";
import useDiary from "@/composables/useDiary";
import useGrades from "@/composables/useGrades";
import useHealth from "@/composables/useHealth";
import useAuth from "@/composables/useAuth";

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

const { errorMessage, loading, loadingEndpoint } = useLoader();
const { subject, customSubject, GM, fetchSubject, clearSubject } = useSubject();
const { currentTab, currentYearName, rememberMe } = useSettings();
const { years, actualYearName, currentYearId, fetchYears } = useYears();
const { terms, actualTermName, currentTermId, fetchTerms } = useTerms();
const { diary, fetchDiary } = useDiary();
const { grades, fetchGrades } = useGrades();
const { checkAvailability } = useHealth();
const { login, logout } = useAuth();

const isGrades = computed(() => currentTab.value === "grades");
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

const showError = (message) => {
  notify.show({
    type: "danger",
    message: message || errorMessage.value,
  });
};

const endSession = () => {
  showError("Сессия завершена");
  logout();
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
  if (
    refetchAttempts.value === REFETCH_ATTEMPTS ||
    refetchAttempts.value < REFETCH_ATTEMPTS
  ) {
    await checkAvailability();
  }
  if (rememberMe.value) {
    try {
      await login({});
    } catch (error) {
      endSession();
      return Promise.reject(error);
    }
  } else {
    endSession();
    return Promise.reject();
  }
};

const getTabs = async ({ forceUpdate }) => {
  try {
    await fetchYears({ force: forceUpdate });
    currentYearName.value = currentYearName.value || actualYearName.value;
    await fetchTerms({
      force: forceUpdate,
      yearId: currentYearId.value,
      yearName: currentYearName.value,
    });
    currentTab.value = currentTab.value || actualTermName.value;
  } catch (error) {
    try {
      if (error.response.status === 401) {
        await restoreSession();
      }
      await startSession({ forceUpdate: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const getContent = async ({ forceUpdate }) => {
  try {
    isGrades.value
      ? await fetchGrades({
          yearId: currentYearId.value,
          yearName: currentYearName.value,
          force: forceUpdate,
        })
      : await fetchDiary({
          termId: currentTermId.value,
          termName: currentTab.value,
          yearName: currentYearName.value,
          force: forceUpdate,
        });
  } catch (error) {
    try {
      if (error.response.status === 401) {
        await restoreSession();
      }
      await startSession({ forceUpdate: true });
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
  clearSubject();
  showSubjectModal.value = true;
  try {
    await fetchSubject(selectedSubject);
  } catch (error) {
    if (error.response.status === 401) {
      await restoreSession();
    }
    await startSession({ forceUpdate: true });
    const lastSubject = diary.value.find(
      (s) => s.Name === selectedSubject.Name
    );
    await fetchSubject(lastSubject);
  }
};

startSession({ forceUpdate: false });
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
