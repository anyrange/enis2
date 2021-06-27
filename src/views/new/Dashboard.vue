<template>
  <nav
    class="w-full border-b-2 border-gray-300-spotify dark:border-gray-600-spotify"
  >
    <tabs v-model="current_term">
      <tab
        v-for="(term, index) in terms"
        :key="term"
        :name="term.Name"
        @click="getDiary(term)"
      >
        {{ getTermLable(index + 1) }}
      </tab>

      <!-- <tab name="1grade">I</tab>
      <tab name="2grade">II</tab>
      <tab name="3grade">III</tab>
      <tab name="4grade">IV</tab> -->

      <tab name="tabel">
        <tabel-icon />
      </tab>
    </tabs>
  </nav>
  <section class="flex w-full justify-center p-4">
    <div
      class="flex flex-col w-3/5 py-2 divide-y divide-gray-700-spotify rounded-sm dark:bg-gray-800-spotify"
    >
      <!--  -->
      <div
        class="flex flex-row py-2 px-3 gap-3 justify-between items-center cursor-pointer duration-200 hover:bg-gray-100 dark:hover:bg-gray-600-spotify"
      >
        <div class="flex flex-col flex-grow">
          <div class="text-sm leading-snug">
            Английский язык
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-medium">
              85.63%
            </span>
            <linear-progress :value="85.63" />
          </div>
        </div>
        <span class="text-right font-semibold text-base">5</span>
      </div>
      <!--  -->
    </div>
  </section>
  <div class="fixed bottom-8 inset-x-0">
    <div class="flex justify-center">
      <base-button label="Выйти" rounded color="negative" @click="logout()" />
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import BaseButton from "@/components/BaseButton.vue";
import TabelIcon from "@/components/icons/TabelIcon.vue";
import LinearProgress from "@/components/LinearProgress.vue";
import { mapActions } from "vuex";
import { terms, diary, subject, grades } from "@/api";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    TabelIcon,
    LinearProgress,
  },
  data() {
    return {
      loading: true,
      loadingTerms: true,
      loadingSubject: true,
      marks: [],
      diary: [],
      grades: [],
      terms: [],
      current_term: "",
      modalOpened: false,
      chosenTab: "marks",
      subjectTab: "sau",
      selectedSubject: {
        SAU: {},
        SAT: {},
      },
    };
  },
  methods: {
    ...mapActions(["logout"]),
    async getDiary(term) {
      const id = term.Id;
      const termName = term.Name;
      if (this.diary.find((term) => termName === term.termName)) {
        this.chooseTerm(termName);
        return;
      }
      this.loading = true;
      try {
        const response = await diary(id);
        this.diary.push({
          termName: termName,
          data: response.data,
        });
        this.chooseTerm(termName);
      } catch {
        this.logout();
      } finally {
        this.loading = false;
      }
    },
    async fetchTerms() {
      try {
        this.terms = await terms();
        this.getDiary(this.terms[this.terms.length - 1]);
      } finally {
        this.loadingTerms = false;
      }
    },
    async fetchGrades() {
      if (!this.grades.length) {
        this.loading = true;
        try {
          this.grades = await grades();
        } finally {
          this.loading = false;
        }
      }
    },
    async selectSubject(subj) {
      this.modalOpened = true;
      this.loadingSubject = true;
      try {
        this.selectedSubject.SAU = await subject(
          subj.JournalId,
          subj.Evaluations[0].Id
        );
        this.selectedSubject.SAT = await subject(
          subj.JournalId,
          subj.Evaluations[1].Id
        );
      } finally {
        this.loadingSubject = false;
      }
    },
    chooseTerm(termName) {
      this.marks = this.diary.find((term) => termName === term.termName);
      this.current_term = termName;
      this.chosenTab = "marks";
    },
    chooseGrades() {
      this.chosenTab = "grades";
      this.current_term = "grades";
      this.fetchGrades();
    },
    sortByScore(array) {
      return array.sort((a, b) => {
        return b.Score - a.Score;
      });
    },
    formatScore(score) {
      if (score === "true") return "Зачёт";
      if (score === "false") return "Незачёт";
      return score;
    },
    getTermLable(index) {
      if (index === 1) return "I";
      if (index === 2) return "II";
      if (index === 3) return "III";
      return "IV";
    },
  },
  created() {
    this.fetchTerms();
  },
};
</script>
