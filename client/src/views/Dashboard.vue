<template>
  <div class="flex flex-col h-screen">
    <main v-if="alive" class="flex-1 flex flex-col overflow-y-hidden">
      <header>
        <tabs v-model="currentYearName" class="tabs-bg">
          <div class="tabs-container">
            <tab
              v-for="year in years.data"
              :key="year.value"
              :name="year.label"
              :loading="loading"
              @selected="
                getTermsAndContentByYear({ yearName: year.label, force: false })
              "
            >
              {{ year.label }}
            </tab>
          </div>
        </tabs>
        <tabs
          v-model="currentTab"
          class="tabs-bg floating-nav"
          :class="{ 'floating-nav--hidden': !showTabs }"
        >
          <div class="tabs-container">
            <tab
              v-for="(term, index) in terms"
              :key="term.Id"
              :name="term.Name"
              @selected="getContent(term.Name)"
            >
              {{ $options.GREEK_NUMERALS[index + 1] }}
            </tab>
            <tab name="grades" @selected="getContent('grades')">
              <grades-icon />
            </tab>
          </div>
        </tabs>
      </header>
      <section id="content" class="flex w-full justify-center overflow-y-auto">
        <section class="mt-12 flex flex-col p-3 space-y-3 sm:w-450px w-full">
          <error v-if="error && !loading && loadingEndpoint !== 'SUBJECT'">
            {{ errorMessage }}
          </error>
          <template v-else>
            <template v-if="isGrades">
              <subject-grades
                v-for="item in grades"
                :key="item"
                :subject="item"
              />
            </template>
            <template v-else>
              <subject-diary
                v-for="item in diary"
                :key="item"
                :subject="item"
                @click="openSubjectModal(item)"
              />
            </template>
          </template>
        </section>
      </section>
    </main>
    <main v-else class="flex justify-center items-center h-screen">
      <random-gif />
    </main>
    <footer>
      <div
        class="absolute bottom-4"
        style="left: 50%; transform: translateX(-50%)"
      >
        <base-button rounded color="negative" @click="signOut()">
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
        <theme-toggler />
      </div>
    </footer>
    <modal :show="showSubjectModal" @close="showSubjectModal = false">
      <div class="flex flex-col space-y-2">
        <subject-diary :hoverable="false" :subject="subject.current" />
        <loading-dots v-if="loading" />
        <template v-else>
          <div
            v-if="error && loadingEndpoint === 'SUBJECT'"
            class="p-2 text-center"
          >
            {{ errorMessage }}
          </div>
          <template v-else>
            <subject-sections label="СОР" :subject="subject.SAU" />
            <subject-sections label="СОЧ" :subject="subject.SAT" />
          </template>
        </template>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { notify } from "../services/notify.js";
import Tabs from "../components/Tabs.vue";
import Tab from "../components/Tab.vue";
import BaseButton from "../components/BaseButton.vue";
import LoadingDots from "../components/LoadingDots.vue";
import Modal from "../components/Modal.vue";
import SubjectDiary from "../components/SubjectDiary.vue";
import SubjectGrades from "../components/SubjectGrades.vue";
import SubjectSections from "../components/SubjectSections.vue";
import GradesIcon from "../components/icons/GradesIcon.vue";
import Error from "../components/Error.vue";
import RandomGif from "../components/RandomGif.vue";
import ThemeToggler from "../components/ThemeToggler.vue";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    LoadingDots,
    Modal,
    SubjectDiary,
    SubjectGrades,
    SubjectSections,
    GradesIcon,
    Error,
    RandomGif,
    ThemeToggler,
  },
  data() {
    return {
      showTabs: true,
      scrollPosition: 0,
      contentWindow: null,
      showSubjectModal: false,
      refetchAttempts: 0,
      error: false,
    };
  },
  GREEK_NUMERALS: {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
  },
  ERROR_MESSAGES: {
    SUBJECT: "Не удалось загрузить информацию о предмете",
    DIARY: "Не удалось загрузить дневник",
    GRADES: "Не удалось загрузить табель",
  },
  computed: {
    ...mapState({
      years: "years",
      subject: "subject",
      actualTermName: (state) => state.terms.actual,
      actualYearName: (state) => state.years.actual,
      alive: (state) => state.health.alive,
      loading: (state) => state.loader.status,
      loadingEndpoint: (state) => state.loader.endpoint,
    }),
    ...mapGetters({
      getTermId: "terms/getTermId",
      getYearId: "years/getYearId",
      getCurrentTerms: "terms/getCurrentTerms",
      getCurrentDiary: "diary/getCurrentDiary",
      getCurrentGrades: "grades/getCurrentGrades",
    }),
    errorMessage() {
      return this.error
        ? this.$options.ERROR_MESSAGES[this.loadingEndpoint]
        : null;
    },
    isGrades() {
      return this.currentTab === "grades";
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
    await this.startSession({ force: false });
  },
  mounted() {
    this.contentWindow = document.getElementById("content");
    this.contentWindow.addEventListener("scroll", this.handleScroll);
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
    async startSession({ force }) {
      await this.getTabs({ force });
      await this.getContent(this.currentTab);
    },
    async restoreSession() {
      if (!this.$store.state.preferences.remember) {
        return this.endSession();
      }
      try {
        await this.$store.dispatch(
          "auth/login",
          this.$store.state.auth.savedAccount
        );
      } catch {
        this.endSession();
      }
    },
    endSession() {
      notify.show({
        type: "danger",
        message: "Сессия завершена",
      });
      this.signOut();
    },
    signOut() {
      this.logout();
      this.error = false;
      this.$store.commit("health/SET_AVAILABILITY", true);
    },
    async getTabs({ force }) {
      try {
        await this.fetchYears({ force });
        this.currentYearName = this.currentYearName || this.actualYearName;
        await this.fetchTerms({
          force,
          yearId: this.getYearId(this.currentYearName),
          yearName: this.currentYearName,
        });
        this.currentTab = this.currentTab || this.actualTermName;
        this.error = false;
        this.refetchAttempts = 0;
      } catch (error) {
        if (this.refetchAttempts >= 1) {
          return;
        }
        this.refetchAttempts++;
        if (error.response.status === 401) {
          await this.restoreSession();
          await this.startSession({ force: true });
        } else {
          await this.checkAvailability();
          this.error = true;
        }
      }
    },
    async getContent(tab) {
      try {
        tab === "grades"
          ? await this.fetchGrades({
              yearId: this.getYearId(this.currentYearName),
              yearName: this.currentYearName,
            })
          : await this.fetchDiary({
              termId: this.getTermId({
                termName: tab,
                yearName: this.currentYearName,
              }),
              termName: tab,
              yearName: this.currentYearName,
            });
        this.error = false;
        this.refetchAttempts = 0;
      } catch (error) {
        if (this.refetchAttempts >= 1) {
          return;
        }
        this.refetchAttempts++;
        if (error.response.status === 401) {
          await this.restoreSession();
          await this.startSession({ force: true });
        } else {
          this.error = true;
        }
      }
    },
    async getTermsAndContentByYear({ yearName, force }) {
      try {
        await this.fetchTerms({
          yearId: this.getYearId(yearName),
          yearName: yearName,
          force: force,
        });
        await this.getContent(this.currentTab || this.actualTermName);
        this.error = false;
        this.refetchAttempts = 0;
      } catch (error) {
        if (this.refetchAttempts >= 1) {
          return;
        }
        this.refetchAttempts++;
        if (error.response.status === 401) {
          await this.restoreSession();
          await this.fetchYears({ force: true });
          await this.getTermsAndContentByYear({
            yearName: this.currentYearName,
            force: true,
          });
        } else {
          this.error = true;
        }
      }
    },
    async openSubjectModal(subject) {
      if (subject.Name === this.subject.current.Name && this.showSubjectModal) {
        return;
      }
      this.$store.commit("subject/CLEAR_SUBJECT");
      this.showSubjectModal = true;
      try {
        await this.fetchSubject(subject);
        this.error = false;
        this.refetchAttempts = 0;
      } catch (error) {
        if (this.refetchAttempts >= 1) {
          return;
        }
        this.refetchAttempts++;
        if (error.response.status === 401) {
          await this.restoreSession();
          await this.startSession({ force: true });
          await this.fetchSubject(subject);
        } else {
          this.error = true;
        }
      }
    },
    handleScroll() {
      this.scrollPosition = this.contentWindow.scrollTop;
      this.showTabs = this.scrollPosition <= 48;
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
  @apply fixed w-full;
  @apply transition transition-transform duration-300;
  transform: translate3d(0, 0, 0);
}
.floating-nav.floating-nav--hidden {
  transform: translate3d(0, -100%, 0);
}
</style>
