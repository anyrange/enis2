<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900-spotify">
    <div class="flex-1 flex flex-col overflow-y-hidden">
      <header>
        <tabs v-model="currentYear" class="tabs-bg">
          <div class="tabs-container">
            <tab
              v-for="year in years.data"
              :key="year.value"
              :name="year.value"
              :disabled="loading"
              @selected="getTermsAndContentByYear(year.value)"
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
              :name="term.Id"
              :disabled="loading"
              @selected="getContent(term.Id)"
            >
              {{ $options.GREEK_NUMERALS[index + 1] }}
            </tab>
            <tab
              name="grades"
              :disabled="loading"
              @selected="getContent('grades')"
            >
              <grades-icon />
            </tab>
          </div>
        </tabs>
      </header>
      <main id="content" class="flex w-full justify-center overflow-y-auto">
        <section
          class="
            mt-12
            flex flex-col
            p-3
            space-y-3
            sm:w-3/4
            md:w-1/2
            xl:w-1/4
            w-full
          "
        >
          <spinner v-if="loading" />
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
                  v-for="item in sortByScore(currentTermDiary(currentTab))"
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
    <modal :show="subjectModalOpened" @close="subjectModalOpened = false">
      <div class="flex flex-col space-y-2">
        <subject-diary :hoverable="false" :subject="subject.data.current" />
        <loader v-if="subject.loading" />
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
  </div>
</template>

<script>
import Tabs from "../components/Tabs.vue";
import Tab from "../components/Tab.vue";
import BaseButton from "../components/BaseButton.vue";
import Spinner from "../components/Spinner.vue";
import Loader from "../components/Loader.vue";
import Modal from "../components/Modal.vue";
import SubjectDiary from "../components/SubjectDiary.vue";
import SubjectGrades from "../components/SubjectGrades.vue";
import SubjectSections from "../components/SubjectSections.vue";
import GradesIcon from "../components/icons/GradesIcon.vue";
import Error from "../components/Error.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    Spinner,
    Loader,
    Modal,
    SubjectDiary,
    SubjectGrades,
    SubjectSections,
    GradesIcon,
    Error,
  },
  data() {
    return {
      subjectModalOpened: false,
      error: false,
      subjectError: false,
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
      diary: "diary",
      grades: "grades",
      subject: "subject",
    }),
    ...mapGetters({
      actualTermId: "terms/actualTermId",
      actualYearId: "years/actualYearId",
      currentTermDiary: "diary/getDiaryByTermId",
    }),
    currentTab: {
      get() {
        return this.$store.state.preferences.tab;
      },
      set(value) {
        this.$store.commit("preferences/SET_TAB", value);
      },
    },
    currentYear: {
      get() {
        return this.$store.state.preferences.year;
      },
      set(value) {
        this.$store.commit("preferences/SET_YEAR", value);
      },
    },
    loading() {
      return (
        this.years.loading ||
        this.terms.loading ||
        this.diary.loading ||
        this.grades.loading
      );
    },
  },
  async created() {
    try {
      await this.fetchYears();
      this.currentYear = this.currentYear || this.actualYearId;
      await this.fetchTermsByYear(this.currentYear);
      this.currentTab = this.currentTab || this.actualTermId;
      await this.getContent(this.currentTab);
    } catch (error) {
      this.error = error?.response?.data?.message || "Что-то пошло не так";
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
      fetchTermsByYear: "terms/fetchTermsByYear",
    }),
    async getContent(tab) {
      try {
        tab === "grades"
          ? await this.fetchGrades(this.currentYear)
          : await this.fetchDiary(tab);
        this.error = "";
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getTermsAndContentByYear(yearId) {
      try {
        const previusTabName =
          this.currentTab === "grades"
            ? "grades"
            : this.terms.data.find((term) => term.Id === this.currentTab)
                ?.Name || "";
        await this.fetchTermsByYear(yearId);
        const currentTabName =
          this.currentTab === "grades"
            ? "grades"
            : this.terms.data.find((term) => term.Name === previusTabName)
                ?.Id || "";
        this.currentTab = currentTabName || this.actualTermId;
        await this.getContent(this.currentTab);
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async showSubject(subject) {
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
      if (this.scrollPosition >= 48) {
        this.showTabs = false;
      } else {
        this.showTabs = true;
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
  @apply flex w-full md:w-1/2 m-auto;
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
