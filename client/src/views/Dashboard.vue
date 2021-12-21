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
          {{ $options.GREEK_NUMERALS[index + 1] }}
        </tab>
        <tab name="grades" @selected="getContent({ forceUpdate: false })">
          <grades-icon />
        </tab>
      </div>
    </tabs>
  </header>
  <main class="flex justify-center p-3">
    <section class="flex flex-col h-80vh space-y-3 mb-6 w-full sm:w-450px">
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
        @click="signOut()"
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
  <modal :show="showSubjectModal" @close="showSubjectModal = false">
    <template #top-right>
      <base-button
        flat
        icon
        aria-label="Toggle GM"
        class="!shadow-transparent !text-light-50"
        :ripple="false"
        @click="GM = !GM"
      >
        <span role="img" aria-label="GodMode" class="text-lg"> 🤔 </span>
      </base-button>
    </template>
    <div class="flex flex-col space-y-2">
      <subject-diary
        :hoverable="false"
        :subject="GM ? customSubject : subject.originalSubject"
      />
      <loading-dots v-if="loading" />
      <template v-else-if="!subject && loadingEndpoint === 'SUBJECT'">
        <div class="p-2 text-center">
          {{ errorMessage }}
        </div>
      </template>
      <template v-else>
        <subject-sections
          label="СОР"
          :subject="
            GM ? subject.customSections.SAU : subject.originalSections.SAU
          "
        />
        <subject-sections
          label="СОЧ"
          :subject="
            GM ? subject.customSections.SAT : subject.originalSections.SAT
          "
        />
      </template>
    </div>
  </modal>
  <modal :show="showSettingsModal" @close="showSettingsModal = false">
    <div class="flex flex-col space-y-4 p-2">
      <div class="flex flex-col space-y-2">
        <span class="text-lg">Настройки</span>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Темная тема </span>
          <div>
            <base-switch id="darkTheme" v-model="darkTheme" />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Текущая четверть </span>
          <div>
            <base-select v-model="actualTermName" :options="$options.TERMS" />
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <span class="text-lg">Журнал</span>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Скрыть пустые </span>
          <div>
            <base-switch id="hideEmpty" v-model="hideEmpty" />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Сортировать </span>
          <div>
            <base-select v-model="sortBy" :options="$options.SORT" />
          </div>
        </div>
      </div>
      <div>
        <base-button v-if="rememberMe" color="negative" @click="signOut()">
          Выйти
        </base-button>
      </div>
      <div class="flex flex-col space-y-2">
        <span class="text-lg">Links</span>
        <div class="flex items-center space-x-3">
          <a class="settings-link" :href="$options.GH_LINK" target="_blank">
            repo
          </a>
          <a class="settings-link" :href="$options.TG_LINK" target="_blank">
            chat
          </a>
          <a class="settings-link" :href="$options.DA_LINK" target="_blank">
            donate
          </a>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { notify } from "../services/notify.js";
import { DA_LINK, GH_LINK, TG_LINK } from "../settings";
import Tabs from "../components/Tabs.vue";
import Tab from "../components/Tab.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseSelect from "../components/BaseSelect.vue";
import BaseSwitch from "../components/BaseSwitch.vue";
import LoadingDots from "../components/LoadingDots.vue";
import Modal from "../components/Modal.vue";
import SubjectDiary from "../components/SubjectDiary.vue";
import SubjectGrades from "../components/SubjectGrades.vue";
import SubjectSections from "../components/SubjectSections.vue";
import GradesIcon from "../components/icons/GradesIcon.vue";
import SettingsIcon from "../components/icons/SettingsIcon.vue";
import RandomEmoticon from "../components/RandomEmoticon.vue";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    BaseSelect,
    BaseSwitch,
    LoadingDots,
    Modal,
    SubjectDiary,
    SubjectGrades,
    SubjectSections,
    GradesIcon,
    SettingsIcon,
    RandomEmoticon,
  },
  data() {
    return {
      refetchAttempts: 0,
      showSubjectModal: false,
      showSettingsModal: false,
      showYears: true,
      scrollPosition: 0,
      scrollOffset: 40,
    };
  },
  DA_LINK,
  GH_LINK,
  TG_LINK,
  GREEK_NUMERALS: {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
  },
  SORT: [
    {
      value: "score",
      label: "По процентам",
    },
    {
      value: "name",
      label: "По алфавиту",
    },
  ],
  TERMS: [
    {
      value: "1",
      label: "Первая",
    },
    {
      value: "2",
      label: "Вторая",
    },
    {
      value: "3",
      label: "Третья",
    },
    {
      value: "4",
      label: "Четвертая",
    },
  ],
  computed: {
    ...mapState({
      years: "years",
      subject: "subject",
      actualYearName: (state) => state.years.actual,
      loading: (state) => state.loader.status,
      loadingEndpoint: (state) => state.loader.endpoint,
      rememberMe: (state) => state.preferences.remember,
    }),
    ...mapGetters({
      getTermId: "terms/getTermId",
      getYearId: "years/getYearId",
      getCurrentTerms: "terms/getCurrentTerms",
      getCurrentDiary: "diary/getCurrentDiary",
      getCurrentGrades: "grades/getCurrentGrades",
      errorMessage: "loader/errorMessage",
      customSubject: "subject/customSubject",
    }),
    isGrades() {
      return this.currentTab === "grades";
    },
    isEmptyContent() {
      return this.isGrades ? !this.grades.length : !this.diary.length;
    },
    GM: {
      get() {
        return this.$store.state.subject.GM;
      },
      set(value) {
        this.$store.commit("subject/SET_GM", value);
      },
    },
    actualTermName: {
      get() {
        return this.$store.state.terms.actual;
      },
      set(value) {
        this.$store.commit("terms/SET_ACTUAL", value);
      },
    },
    darkTheme: {
      get() {
        return this.$store.state.preferences.theme === "dark";
      },
      set(value) {
        this.$store.commit("preferences/SET_THEME", value ? "dark" : "light");
      },
    },
    currentTab: {
      get() {
        return this.$store.state.preferences.tab;
      },
      set(value) {
        this.$store.commit("preferences/SET_TAB", value);
      },
    },
    currentYearName: {
      get() {
        return this.$store.state.preferences.year;
      },
      set(value) {
        this.$store.commit("preferences/SET_YEAR", value);
      },
    },
    sortBy: {
      get() {
        return this.$store.state.preferences.sortBy;
      },
      set(value) {
        this.$store.commit("preferences/SET_SORT", value);
      },
    },
    hideEmpty: {
      get() {
        return this.$store.state.preferences.hideEmpty;
      },
      set(value) {
        this.$store.commit("preferences/SET_HIDE", value);
      },
    },
    terms() {
      return this.getCurrentTerms({
        yearName: this.currentYearName,
      });
    },
    diary() {
      return this.getCurrentDiary({
        termName: this.currentTab,
        yearName: this.currentYearName,
      });
    },
    grades() {
      return this.getCurrentGrades({
        yearName: this.currentYearName,
      });
    },
  },
  async created() {
    await this.startSession({ forceUpdate: false });
  },
  mounted() {
    this.scrollPosition = window.pageYOffset;
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      fetchDiary: "diary/fetchDiary",
      fetchGrades: "grades/fetchGrades",
      fetchSubject: "subject/fetchSubject",
      fetchYears: "years/fetchYears",
      fetchTerms: "terms/fetchTerms",
      checkAvailability: "health/checkAvailability",
    }),
    handleScroll() {
      this.scrollPosition = window.pageYOffset;
      this.showYears = this.scrollPosition <= this.scrollOffset;
    },
    showError(message) {
      notify.show({
        type: "danger",
        message: message || this.errorMessage,
      });
    },
    signOut() {
      this.logout();
      this.$store.commit("health/SET_AVAILABILITY", true);
    },
    endSession() {
      this.showError("Сессия завершена");
      this.signOut();
    },
    async restoreSession() {
      if (this.rememberMe) {
        try {
          await this.$store.dispatch(
            "auth/login",
            this.$store.state.auth.savedAccount
          );
        } catch (error) {
          this.endSession();
          return Promise.reject(error);
        }
      } else {
        this.endSession();
        return Promise.reject();
      }
    },
    async startSession({ forceUpdate }) {
      this.refetchAttempts++;
      if (this.refetchAttempts > 2) {
        return this.showError();
      }
      try {
        await this.getTabs({ forceUpdate });
        await this.getContent({ forceUpdate });
        this.refetchAttempts = 0;
      } catch (error) {
        await this.checkAvailability();
        return Promise.reject(error);
      }
    },
    async getTabs({ forceUpdate }) {
      try {
        await this.fetchYears({ force: forceUpdate });
        this.currentYearName = this.currentYearName || this.actualYearName;
        await this.fetchTerms({
          force: forceUpdate,
          yearId: this.getYearId(this.currentYearName),
          yearName: this.currentYearName,
        });
        this.currentTab = this.currentTab || this.actualTermName;
      } catch (error) {
        if (error.response.status === 401) {
          await this.restoreSession();
        }
        await this.startSession({ forceUpdate: true });
        return Promise.reject(error);
      }
    },
    async getContent({ forceUpdate }) {
      try {
        this.isGrades
          ? await this.fetchGrades({
              yearId: this.getYearId(this.currentYearName),
              yearName: this.currentYearName,
              force: forceUpdate,
            })
          : await this.fetchDiary({
              termId: this.getTermId({
                termName: this.currentTab,
                yearName: this.currentYearName,
              }),
              termName: this.currentTab,
              yearName: this.currentYearName,
              force: forceUpdate,
            });
      } catch (error) {
        if (error.response.status === 401) {
          await this.restoreSession();
        }
        await this.startSession({ forceUpdate: true });
        return Promise.reject(error);
      }
    },
    async getTermsAndContentByYear({ forceUpdate }) {
      try {
        await this.getTabs({ forceUpdate });
        await this.getContent({ forceUpdate });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async openSubjectModal(subject) {
      if (
        subject.Name === this.subject.originalSubject.Name &&
        this.showSubjectModal
      ) {
        return;
      }
      const subjectName = subject.Name;
      this.$store.commit("subject/CLEAR_SUBJECT");
      this.showSubjectModal = true;
      try {
        await this.fetchSubject(subject);
      } catch (error) {
        if (error.response.status === 401) {
          await this.restoreSession();
        }
        await this.startSession({ forceUpdate: true });
        const lastSubject = this.diary.find((s) => s.Name === subjectName);
        await this.fetchSubject(lastSubject);
      }
    },
  },
};
</script>

<style lang="postcss">
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
