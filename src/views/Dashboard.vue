<template>
  <div class="layout">
    <div class="wrapper">
      <nav class="navbar">
        <tabs class="navbar-tabs" v-model="currentTab">
          <tab
            v-for="(term, index) in terms.data"
            :key="term"
            :name="term.Id"
            :disabled="diary.loading"
          >
            {{ getTermLable(index + 1) }}
          </tab>
          <tab name="grades" :disabled="diary.loading">
            <grades-icon />
          </tab>
        </tabs>
      </nav>
      <main class="content">
        <section class="content-list" v-if="currentTab !== 'grades'">
          <template v-if="diary.loading">
            <spinner />
          </template>
          <template v-else>
            <subject-diary
              v-for="item in sortByScore(currentTermDiary)"
              :key="item"
              :subject="item"
              :disabled="!item.Score"
              @click="showSubject(item)"
            />
          </template>
        </section>
        <section class="content-list" v-else>
          <template v-if="grades.loading">
            <spinner />
          </template>
          <template v-else>
            <subject-grades
              v-for="item in grades.data"
              :key="item"
              :subject="item"
            />
          </template>
        </section>
      </main>
    </div>
    <div class="footer">
      <div class="footer-content">
        <base-button round flat outlined @click="toggleTheme()">
          <sun-icon v-if="theme === 'dark'" />
          <moon-icon v-else />
        </base-button>
        <base-button label="Выйти" rounded color="negative" @click="logout()" />
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import BaseButton from "@/components/BaseButton.vue";
import GradesIcon from "@/components/icons/GradesIcon.vue";
import Spinner from "@/components/Spinner";
import SubjectDiary from "@/components/SubjectDiary";
import SubjectGrades from "@/components/SubjectGrades";
import MoonIcon from "@/components/icons/MoonIcon.vue";
import SunIcon from "@/components/icons/SunIcon.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    GradesIcon,
    Spinner,
    SubjectDiary,
    SubjectGrades,
    MoonIcon,
    SunIcon,
  },
  data() {
    return {
      currentTab: "",
      subjectModalOpened: false,
    };
  },
  computed: {
    ...mapGetters({
      terms: "terms/getTerms",
      diary: "diary/getDiary",
      grades: "grades/getGrades",
      subject: "subject/getSubject",
      theme: "getTheme",
    }),
    currentTermDiary() {
      const foundItem = this.diary.data.find((item) => {
        return item.termId === this.currentTab;
      });
      if (foundItem instanceof Object) return foundItem.data;
      return [];
    },
  },
  watch: {
    currentTab(value) {
      this.setCurrentTerm(value);
      this.showTab(value);
    },
  },
  methods: {
    ...mapActions({
      logout: "logout",
      fetchTerms: "terms/fetchTerms",
      fetchDiary: "diary/fetchDiary",
      fetchGrades: "grades/fetchGrades",
      fetchSubject: "subject/fetchSubject",
      setCurrentTerm: "terms/setCurrentTerm",
      toggleTheme: "toggleTheme",
    }),
    getTermLable(index) {
      const GREEK_NUMERALS = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
      };
      return GREEK_NUMERALS[index];
    },
    sortByScore(array) {
      return array.sort((a, b) => b.Score - a.Score);
    },
    showTab(tab) {
      tab === "grades" ? this.fetchGrades() : this.fetchDiary(tab);
    },
    showSubject(subject) {
      this.subjectModalOpened = true;
      this.fetchSubject(subject);
      console.log(this.subject);
    },
  },
  async created() {
    await this.fetchTerms();
    if (this.terms.selected) {
      this.currentTab = this.terms.selected;
    } else {
      this.currentTab = this.terms.data[this.terms.data.length - 1].Id;
    }
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
.navbar {
  @apply w-full z-20 sticky top-0 bg-white dark:bg-gray-800-spotify border-b-2 border-gray-300 dark:border-gray-600-spotify;
}
.navbar-tabs {
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
.footer {
  left: 50%;
  transform: translateX(-50%);
  @apply absolute bottom-6 bg-gray-200 dark:bg-gray-600-spotify rounded-full;
}
.footer-content {
  @apply flex justify-center gap-2 p-1;
}
</style>