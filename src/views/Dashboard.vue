<template>
  <div class="layout">
    <div class="wrapper">
      <nav class="navbar">
        <tabs class="navbar-tabs" v-model="currentTerm">
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
        <section class="content-list" v-if="currentTerm !== 'grades'">
          <template v-if="diary.loading">
            <spinner />
          </template>
          <template v-else>
            <div
              v-for="subject in currentTermDiary"
              :key="subject"
              class="diary-item"
              @click="showSubject(subject)"
            >
              <div class="diary-item-content">
                <div class="diary-item-content-subject">
                  {{ subject.Name }}
                </div>
                <div class="diary-item-content-score">
                  <span class="diary-item-content-score-label">
                    {{ subject.Score }}%
                  </span>
                  <linear-progress :value="subject.Score" />
                </div>
              </div>
              <span class="diary-item-mark">
                {{ subject.Mark }}
              </span>
            </div>
          </template>
        </section>
        <section class="content-list" v-else>
          <template v-if="grades.loading">
            <spinner />
          </template>
          <template v-else>
            <div
              class="grades-item"
              v-for="subject in grades.data"
              :key="subject"
            >
              <div class="grades-item-top">
                <span class="grades-item-subject">
                  {{ subject.SubjectName }}
                </span>
                <div
                  v-if="subject.Exam !== 'none'"
                  class="grades-item-top-mark"
                >
                  <span class="grades-item-label">{{ subject.Exam }}</span>
                  <span class="grades-item-subtitle">Экзамен</span>
                </div>
                <div
                  v-if="subject.Final !== 'none'"
                  class="grades-item-top-mark"
                >
                  <span class="grades-item-label">{{ subject.Final }}</span>
                  <span class="grades-item-subtitle">Итоговая</span>
                </div>
              </div>
              <div class="grades-item-bottom">
                <template v-if="subject.FirstHalfYear === 'none'">
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">I</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.FirstPeriod) }}
                    </span>
                  </div>
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">II</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.SecondPeriod) }}
                    </span>
                  </div>
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">III</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.ThirdPeriod) }}
                    </span>
                  </div>
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">IV</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.ForthPeriod) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">I и II</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.FirstHalfYear) }}
                    </span>
                  </div>
                  <div class="grades-item-bottom-mark">
                    <span class="grades-item-term">III и IV</span>
                    <span class="grades-item-mark">
                      {{ formatScore(subject.SecondHalfYear) }}
                    </span>
                  </div>
                </template>
                <div class="grades-item-bottom-mark">
                  <span class="grades-item-term">Годовая</span>
                  <span class="grades-item-mark">
                    {{ formatScore(subject.Year) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </section>
      </main>
    </div>
  </div>
  <div class="footer">
    <div class="footer-content">
      <base-button label="Выйти" rounded color="negative" @click="logout()" />
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import BaseButton from "@/components/BaseButton.vue";
import GradesIcon from "@/components/icons/GradesIcon.vue";
import LinearProgress from "@/components/LinearProgress.vue";
import Spinner from "@/components/Spinner";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    GradesIcon,
    LinearProgress,
    Spinner,
  },
  data() {
    return {
      currentTerm: "",
      subjectModalOpened: false,
    };
  },
  computed: {
    ...mapGetters({
      terms: "terms/getTerms",
      diary: "diary/getDiary",
      grades: "grades/getGrades",
      subject: "subject/getSubject",
    }),
    currentTermDiary() {
      const foundItem = this.diary.data.find((item) => {
        return item.termId === this.currentTerm;
      });
      if (foundItem instanceof Object) return foundItem.data;
      return [];
    },
  },
  watch: {
    currentTerm(value) {
      this.setCurrentTerm(value);
      if (value === "grades") {
        this.fetchGrades();
      } else {
        this.fetchDiary(value);
      }
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
    formatScore(score) {
      if (score === "true") return "Зачёт";
      if (score === "false") return "Незачёт";
      return score;
    },
    showSubject(subject) {
      this.subjectModalOpened = true;
      this.fetchSubject(subject);
    },
  },
  async created() {
    await this.fetchTerms();
    if (this.terms.selected) {
      this.currentTerm = this.terms.selected;
    } else {
      this.currentTerm = this.terms.data[this.terms.data.length - 1].Id;
    }
  },
};
</script>

<style lang="postcss" scoped>
.layout {
  @apply flex flex-col h-screen;
}
.wrapper {
  @apply flex-1 flex flex-col overflow-y-hidden;
}
.navbar {
  @apply w-full border-b-2 z-20 sticky top-0 dark:bg-gray-800-spotify border-gray-300 dark:border-gray-600-spotify;
}
.navbar-tabs {
  @apply w-full md:w-1/2;
  margin: 0 auto;
}
.content {
  @apply flex w-full justify-center overflow-y-auto;
}
.content-list {
  @apply flex flex-col content-list-list-width divide-y dark:divide-gray-700-spotify rounded-sm;
}
.content-list-list-width {
  @apply sm:w-3/4 md:w-1/2 xl:w-1/4 w-full;
}
.content::-webkit-scrollbar {
  @apply w-2 dark:bg-gray-700-spotify bg-gray-200;
}
.content::-webkit-scrollbar-thumb {
  @apply dark:bg-gray-450-spotify bg-gray-400-spotify;
}
.footer {
  margin: 0 auto;
  @apply fixed bottom-8 inset-x-0 w-0;
}
.footer-content {
  @apply flex justify-center;
}
.diary-item {
  @apply flex flex-row py-2 px-3 gap-3 justify-between items-center cursor-pointer duration-200 dark:bg-gray-800-spotify hover:bg-gray-100 dark:hover:bg-gray-700-spotify;
}
.diary-item-content {
  @apply flex flex-col flex-grow;
}
.diary-item-mark {
  @apply text-right font-semibold text-base;
}
.diary-item-content-subject {
  @apply text-sm leading-snug;
}
.diary-item-content-score {
  @apply flex flex-col gap-1 mb-2;
}
.diary-item-content-score-label {
  @apply font-medium;
}
.grades-item {
  @apply flex flex-col gap-6 p-4 w-full justify-center dark:bg-gray-800-spotify;
}
.grades-item-subtitle {
  @apply text-sm;
}
.grades-item-top {
  @apply flex items-start justify-between;
}
.grades-item-top-mark {
  @apply flex flex-col items-center;
}
.grades-item-bottom {
  @apply flex w-full justify-between;
}
.grades-item-bottom-mark {
  @apply flex flex-col items-center justify-center;
}
.grades-item-label {
  @apply text-2xl font-medium;
}
.grades-item-subject {
  @apply text-2xl font-medium truncate;
}
.grades-item-term {
  @apply text-sm font-medium;
}
.grades-item-mark {
  @apply text-base;
}
</style>
