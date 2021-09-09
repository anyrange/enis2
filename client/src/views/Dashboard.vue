<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900-spotify">
    <div class="flex-1 flex flex-col overflow-y-hidden">
      <header
        class="
          w-full
          sticky
          top-0
          bg-white
          dark:bg-gray-800-spotify
          border-b-2 border-gray-300
          dark:border-gray-600-spotify
        "
      >
        <tabs v-model="currentTab" class="w-full md:w-1/2 m-auto">
          <tab
            v-for="(term, index) in terms.data"
            :key="term.Id"
            :name="term.Id"
            :disabled="loading"
            @click="getContent(term.Id)"
          >
            {{ $options.GREEK_NUMERALS[index + 1] }}
          </tab>
          <tab name="grades" :disabled="loading" @click="getContent('grades')">
            <grades-icon />
          </tab>
        </tabs>
      </header>
      <main class="flex w-full justify-center overflow-y-auto">
        <section
          class="flex flex-col p-3 gap-y-3 sm:w-3/4 md:w-1/2 xl:w-1/4 w-full"
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
        class="
          absolute
          bottom-6
          bg-gray-200
          dark:bg-gray-600-spotify
          rounded-full
        "
        style="left: 50%; transform: translateX(-50%)"
      >
        <div class="flex justify-center gap-2 p-1">
          <theme-toggler />
          <base-button
            label="Выйти"
            rounded
            color="negative"
            @click="deauthorize()"
          />
        </div>
      </footer>
    </div>
    <modal :show="subjectModalOpened" @close="subjectModalOpened = false">
      <div class="flex flex-col gap-2">
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
import ThemeToggler from "../components/ThemeToggler.vue";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

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
    ThemeToggler,
  },
  data() {
    return {
      subjectModalOpened: false,
      error: false,
      subjectError: false,
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
      savedTab: "preferences/getTab",
      lastTermId: "terms/lastTermId",
      currentTermId: "terms/currentTermId",
      currentYearId: "years/currentYearId",
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
      await this.fetchTermsByYear(this.currentYearId);
      this.currentTab = this.savedTab || this.currentTermId || this.lastTermId;
      await this.getContent(this.currentTab);
    } catch (error) {
      this.error = error.response.data.message;
    }
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
    sortByScore(array) {
      return array.sort((firstEl, secondEl) => secondEl.Score - firstEl.Score);
    },
    async getContent(tab) {
      try {
        tab === "grades"
          ? await this.fetchGrades()
          : await this.fetchDiary(tab);
        this.error = "";
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
    async deauthorize() {
      await this.logout();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
