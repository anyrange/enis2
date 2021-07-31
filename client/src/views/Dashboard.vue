<template>
  <div class="layout">
    <div class="wrapper">
      <header class="header">
        <tabs v-model="currentTab" class="header-tabs">
          <tab
            v-for="(term, index) in terms.data"
            :key="term"
            :name="term.Id"
            :disabled="loading"
          >
            {{ getTermLable(index + 1) }}
          </tab>
          <tab name="grades" :disabled="loading">
            <grades-icon />
          </tab>
        </tabs>
      </header>
      <main class="content">
        <section class="content-list">
          <spinner v-if="loading" />
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
        </section>
      </main>
      <footer class="footer">
        <div class="footer-content">
          <theme-toggler />
          <base-button
            label="Выйти"
            rounded
            color="negative"
            @click="logout()"
          />
        </div>
      </footer>
    </div>
    <modal :show="subjectModalOpened" @close="subjectModalOpened = false">
      <div class="subject-section-wrapper">
        <subject-diary :hoverable="false" :subject="subject.data.current" />
        <loader v-if="subject.loading" />
        <template v-else>
          <subject-sections label="СОР" :subject="subject.data.SAU" />
          <subject-sections label="СОЧ" :subject="subject.data.SAT" />
        </template>
      </div>
    </modal>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import BaseButton from "@/components/BaseButton";
import Spinner from "@/components/Spinner";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import ThemeToggler from "@/components/ThemeToggler";
import SubjectDiary from "@/components/SubjectDiary";
import SubjectGrades from "@/components/SubjectGrades";
import SubjectSections from "@/components/SubjectSections";
import GradesIcon from "@/components/icons/GradesIcon";
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    Spinner,
    Loader,
    Modal,
    ThemeToggler,
    SubjectDiary,
    SubjectGrades,
    SubjectSections,
    GradesIcon,
  },
  data() {
    return {
      currentTab: "",
      subjectModalOpened: false,
    };
  },
  computed: {
    ...mapGetters({
      years: "years/getYears",
      terms: "terms/getTerms",
      diary: "diary/getDiary",
      grades: "grades/getGrades",
      subject: "subject/getSubject",
      savedTab: "preferences/getTab",
      lastTermId: "terms/lastTermId",
      currentYearId: "years/currentYearId",
      currentTermDiary: "diary/getDiaryByTermId",
    }),
    loading() {
      return (
        this.years.loading ||
        this.terms.loading ||
        this.diary.loading ||
        this.grades.loading
      );
    },
  },
  watch: {
    async currentTab(id) {
      try {
        this.saveTab(id);
        id === "grades" ? await this.fetchGrades() : await this.fetchDiary(id);
      } catch {
        this.currentTab = this.lastTermId;
      }
    },
  },
  async created() {
    await this.fetchYears();
    await this.fetchTermsByYear(this.currentYearId);
    this.currentTab = this.savedTab || this.lastTermId;
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
    ...mapMutations({
      saveTab: "preferences/SET_TAB",
    }),
    getTermLable(index) {
      const GREEK_NUMERALS = { 1: "I", 2: "II", 3: "III", 4: "IV" };
      return GREEK_NUMERALS[index];
    },
    sortByScore(array) {
      return array.sort((firstEl, secondEl) => secondEl.Score - firstEl.Score);
    },
    async showSubject(subject) {
      this.subjectModalOpened = true;
      await this.fetchSubject(subject);
    },
  },
};
</script>

<style lang="postcss" scoped>
.layout {
  @apply flex flex-col h-screen bg-gray-100 dark:bg-gray-900-spotify;
}
.wrapper {
  @apply flex-1 flex flex-col overflow-y-hidden;
}
.header {
  @apply w-full sticky top-0 bg-white dark:bg-gray-800-spotify border-b-2 border-gray-300 dark:border-gray-600-spotify;
}
.header-tabs {
  @apply w-full md:w-1/2;
  margin: 0 auto;
}
.content {
  @apply flex w-full justify-center overflow-y-auto;
}
.content::-webkit-scrollbar {
  @apply w-2 dark:bg-gray-700-spotify bg-gray-200;
}
.content::-webkit-scrollbar-thumb {
  @apply dark:bg-gray-450-spotify bg-gray-400-spotify;
}
.content-list {
  @apply flex flex-col p-3 gap-y-3 content-list-list-width;
}
.content-list-list-width {
  @apply sm:w-3/4 md:w-1/2 xl:w-1/4 w-full;
}
.subject-section-wrapper {
  @apply flex flex-col gap-2;
}
.subject-section-placeholder {
  @apply rounded dark:bg-gray-800-spotify bg-gray-200 w-full h-36;
}
.footer {
  left: 50%;
  transform: translateX(-50%);
  @apply absolute bottom-6 bg-gray-200 dark:bg-gray-600-spotify rounded-full;
}
.footer-content {
  @apply flex justify-center gap-2 p-1;
}
</style>
