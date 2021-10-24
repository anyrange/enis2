<template>
  <div class="flex flex-col h-screen">
    <div
      class="flex-1 flex flex-col overflow-y-hidden"
      :class="{
        'justify-center items-center': !smsAvailable,
      }"
    >
      <random-gif v-if="!smsAvailable" class="text-center" />
      <header>
        <tabs v-model="currentYearName" class="tabs-bg">
          <div class="tabs-container">
            <tab
              v-for="year in years.data"
              :key="year.value"
              :name="year.label"
              :loading="loading"
              @selected="getTermsAndContentByYear(year.label)"
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
          <loading-spinner v-if="loading" />
          <template v-else>
            <error v-if="error">{{ error }}</error>
            <template v-else>
              <template v-if="currentTab === 'grades'">
                <subject-grades
                  v-for="item in grades.data"
                  :key="item"
                  :subject="item"
                />
              </template>
              <template v-else>
                <subject-diary
                  v-for="item in sortByScore(
                    getCurrentTermDiary({
                      termName: currentTab,
                      yearName: currentYearName,
                    })
                  )"
                  :key="item"
                  :subject="item"
                  @click="showSubject(item)"
                />
              </template>
            </template>
          </template>
        </section>
      </main>
      <footer
        class="absolute bottom-4 rounded-full"
        style="left: 50%; transform: translateX(-50%)"
      >
        <base-button rounded color="negative" @click="logout()">
          Выйти
        </base-button>
      </footer>
    </div>
    <modal :show="subjectModalOpened" @close="closeModal()">
      <div class="flex flex-col space-y-2">
        <subject-diary :hoverable="false" :subject="subject.data.current" />
        <loading-dots v-if="subject.loading" />
        <template v-else>
          <template v-if="!subjectError">
            <subject-sections label="СОР" :subject="subject.data.SAU" />
            <subject-sections label="СОЧ" :subject="subject.data.SAT" />
          </template>
          <div v-else class="p-2 text-center">
            Не удалось загрузить информацию о предмете
          </div>
        </template>
      </div>
    </modal>
    <modal
      :show="showAvailabilityNotification"
      @close="showAvailabilityNotification = false"
    >
      <div class="flex flex-col space-y-2">
        <h1>😞</h1>
        <p>
          <a
            :href="`https://sms.${school}.nis.edu.kz/`"
            target="_blank"
            class="underline"
          >
            Оригинальный клиент</a
          >
          не работает
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import Tabs from "../components/Tabs.vue";
import Tab from "../components/Tab.vue";
import BaseButton from "../components/BaseButton.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import LoadingDots from "../components/LoadingDots.vue";
import Modal from "../components/Modal.vue";
import SubjectDiary from "../components/SubjectDiary.vue";
import SubjectGrades from "../components/SubjectGrades.vue";
import SubjectSections from "../components/SubjectSections.vue";
import GradesIcon from "../components/icons/GradesIcon.vue";
import Error from "../components/Error.vue";
import RandomGif from "../components/RandomGif.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { debounce } from "../utils";
import { checkSmsAvailability } from "../api";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    LoadingSpinner,
    LoadingDots,
    Modal,
    SubjectDiary,
    SubjectGrades,
    SubjectSections,
    GradesIcon,
    Error,
    RandomGif,
  },
  data() {
    return {
      subjectModalOpened: false,
      error: false,
      subjectError: false,
      showTabs: true,
      scrollPosition: 0,
      contentWindow: null,
      loading: false,
      retryContentAmount: 0,
      retryYearsAndTermsAmount: 0,
      checkingAvailability: false,
      smsAvailable: true,
      showAvailabilityNotification: false,
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
      diary: "diary",
      grades: "grades",
      subject: "subject",
    }),
    ...mapGetters({
      actualTermName: "terms/actualTermName",
      getTermIdByName: "terms/getTermIdByName",
      actualYearName: "years/actualYearName",
      getYearIdByName: "years/getYearIdByName",
      getCurrentTermDiary: "diary/getCurrentTermDiary",
      school: "preferences/getSchool",
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
    loadingStates() {
      return (
        this.years.loading ||
        this.terms.loading ||
        this.diary.loading ||
        this.grades.loading ||
        this.checkingAvailability
      );
    },
  },
  watch: {
    loadingStates: debounce(function (value) {
      this.loading = value;
    }, 5),
  },
  async created() {
    try {
      this.checkingAvailability = true;
      const { alive } = await checkSmsAvailability();
      this.smsAvailable = alive;
      this.showAvailabilityNotification = !alive;
      if (!alive) return;
    } finally {
      this.checkingAvailability = false;
    }
    try {
      await this.fetchYears();
      this.currentYearName = this.currentYearName || this.actualYearName;
      await this.fetchTerms(this.getYearIdByName(this.currentYearName));
      this.currentTab = this.currentTab || this.actualTermName;
      await this.getContent(this.currentTab);
    } catch (error) {
      if (error.response.status === 401) return;
      this.error = error.response.data.message || "Что-то пошло не так";
    }
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
    }),
    async getContent(tab) {
      try {
        tab === "grades"
          ? await this.fetchGrades(this.getYearIdByName(this.currentYearName))
          : await this.fetchDiary({
              termId: this.getTermIdByName(tab),
              termName: tab,
              yearName: this.currentYearName,
            });
        this.error = "";
      } catch (error) {
        if (this.retryContentAmount >= 1) return;
        this.retryContentAmount++;
        this.error = error.response.data.message;
        tab === "grades"
          ? await this.fetchYears()
          : await this.fetchTerms(this.getYearIdByName(this.currentYearName));
        await this.getContent(this.currentTab);
      }
    },
    async getTermsAndContentByYear(yearName) {
      try {
        await this.fetchTerms(this.getYearIdByName(yearName));
        await this.getContent(this.currentTab || this.actualTermName);
      } catch (error) {
        if (this.retryYearsAndTermsAmount >= 1) return;
        this.retryYearsAndTermsAmount++;
        this.error = error.response.data.message;
        await this.fetchYears();
        await this.getTermsAndContentByYear(this.currentYearName);
      }
    },
    closeModal() {
      this.subjectModalOpened = false;
      setTimeout(() => {
        this.$store.commit("subject/CLEAR_SUBJECT");
      }, 100);
    },
    async showSubject(subject) {
      if (subject.Name === this.subject.data.current.Name) return;
      this.subjectModalOpened = true;
      try {
        await this.fetchSubject(subject);
        this.subjectError = false;
      } catch (error) {
        this.subjectError = true;
      }
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
  @apply transition duration-300;
  transform: translate3d(0, 0, 0);
}
.floating-nav.floating-nav--hidden {
  transform: translate3d(0, -100%, 0);
}
</style>
