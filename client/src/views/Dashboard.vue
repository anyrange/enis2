<template>
  <div class="flex flex-col h-screen">
    <div class="flex-1 flex flex-col overflow-y-hidden">
      <header>
        <tabs v-model="currentYearName" class="tabs-bg">
          <div class="tabs-container">
            <tab
              v-for="year in years.data"
              :key="year.value"
              :name="year.label"
              :loading="loading"
              @selected="getTermsAndContentByYear({ yearName: year.label })"
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
              v-for="(term, index) in terms.data"
              :key="term.Id"
              :name="term.Name"
              :loading="loading"
              @selected="getContent(term.Name)"
            >
              {{ $options.GREEK_NUMERALS[index + 1] }}
            </tab>
            <tab
              v-if="terms.data.length"
              name="grades"
              :loading="loading"
              @selected="getContent('grades')"
            >
              <grades-icon />
            </tab>
          </div>
        </tabs>
      </header>
      <main id="content" class="flex w-full justify-center overflow-y-auto">
        <section class="mt-12 flex flex-col p-3 space-y-3 sm:w-450px w-full">
          <template v-if="alive">
            <error v-if="error">
              <span v-if="isGrades">Не удалось загрузить табель</span>
              <span v-else>Не удалось загрузить дневник</span>
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
                  v-for="item in sortByScore(diary)"
                  :key="item"
                  :subject="item"
                  @click="openSubjectModal(item)"
                />
              </template>
            </template>
          </template>
          <random-gif v-else />
        </section>
      </main>
      <div
        class="absolute bottom-4"
        style="left: 50%; transform: translateX(-50%)"
      >
        <base-button rounded color="negative" @click="logout()">
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
    </div>
    <modal :show="subjectModal" @close="closeSubjectModal()">
      <div class="flex flex-col space-y-2">
        <subject-diary :hoverable="false" :subject="subject.current" />
        <loading-dots v-if="loading && loadingEndpoint === 'SUBJECT'" />
        <template v-else>
          <div v-if="subjectError" class="p-2 text-center">
            Не удалось загрузить информацию о предмете
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
      error: false,
      subjectError: false,
      subjectModal: false,
      showTabs: true,
      scrollPosition: 0,
      contentWindow: null,
    };
  },
  GREEK_NUMERALS: {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
  },
  computed: {
    ...mapState({
      years: "years",
      terms: "terms",
      subject: "subject",
      alive: (state) => state.health.alive,
      loading: (state) => state.loader.status,
      loadingEndpoint: (state) => state.loader.endpoint,
    }),
    ...mapGetters({
      actualTermName: "terms/actualTermName",
      getTermIdByName: "terms/getTermIdByName",
      actualYearName: "years/actualYearName",
      getYearIdByName: "years/getYearIdByName",
      getCurrentTermDiary: "diary/getCurrentTermDiary",
      getCurrentTermGrades: "grades/getCurrentTermGrades",
    }),
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
    diary() {
      return this.getCurrentTermDiary({
        termName: this.currentTab,
        yearName: this.currentYearName,
      });
    },
    isGrades() {
      return this.currentTab === "grades";
    },
    grades() {
      return this.getCurrentTermGrades({
        yearName: this.currentYearName,
      });
    },
  },
  async created() {
    await this.getTabs({ force: false });
    await this.getContent(this.currentTab);
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
    endSession() {
      notify.show({
        type: "danger",
        message: "Сессия завершена",
      });
      this.logout();
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
        return Promise.resolve();
      } catch {
        this.endSession();
        return Promise.reject();
      }
    },
    async getTabs({ force }) {
      try {
        await this.fetchYears({ force: force });
        this.currentYearName = this.currentYearName || this.actualYearName;
        await this.fetchTerms({
          force: force,
          yearId: this.getYearIdByName(this.currentYearName),
        });
        this.currentTab = this.currentTab || this.actualTermName;
      } catch (error) {
        let tries = 0;
        if (tries >= 1) {
          return;
        }
        tries++;
        if (error.response.status === 401) {
          this.restoreSession().then(async () => {
            await this.getTabs({
              forceUpdate: true,
            });
          });
        } else {
          this.error = true;
        }
        await this.checkAvailability();
      }
    },
    async getContent(tab) {
      try {
        tab === "grades"
          ? await this.fetchGrades({
              yearId: this.getYearIdByName(this.currentYearName),
              yearName: this.currentYearName,
            })
          : await this.fetchDiary({
              termId: this.getTermIdByName(tab),
              termName: tab,
              yearName: this.currentYearName,
            });
        this.error = false;
      } catch (error) {
        let tries = 0;
        if (tries >= 1) {
          return;
        }
        tries++;
        if (error.response.status === 401) {
          this.restoreSession().then(async () => {
            await this.getTabs({ force: true });
            await this.getContent(this.currentTab);
          });
        } else {
          this.error = true;
        }
      }
    },
    async getTermsAndContentByYear({ yearName, force = false }) {
      try {
        await this.fetchTerms({
          yearId: this.getYearIdByName(yearName),
          force: force,
        });
        await this.getContent(this.currentTab || this.actualTermName);
      } catch (error) {
        let tries = 0;
        if (tries >= 1) {
          return;
        }
        tries++;
        if (error.response.status === 401) {
          this.restoreSession().then(async () => {
            await this.fetchYears({ force: true });
            await this.getTermsAndContentByYear({
              yearName: this.currentYearName,
              force: true,
            });
          });
        } else {
          this.error = true;
        }
      }
    },
    async openSubjectModal(subject) {
      if (subject.Name === this.subject.current.Name && this.subjectModal) {
        return;
      }
      this.$store.commit("subject/CLEAR_SUBJECT");
      this.subjectModal = true;
      try {
        await this.fetchSubject(subject);
        this.subjectError = false;
      } catch {
        this.subjectError = true;
      }
    },
    closeSubjectModal() {
      this.subjectModal = false;
    },
    sortByScore(array) {
      return array.sort((firstEl, secondEl) => secondEl.Score - firstEl.Score);
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
