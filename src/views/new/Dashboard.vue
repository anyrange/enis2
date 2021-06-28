<template>
  <nav class="nav-bar">
    <tabs v-if="!terms.loading" v-model="currentTerm">
      <tab v-for="(term, index) in terms.data" :key="term" :name="term.Id">
        {{ getTermLable(index + 1) }}
      </tab>
      <tab name="grades">
        <grades-icon />
      </tab>
    </tabs>
  </nav>
  <div class="flex flex-col divide-y border-black p-2">
    <span> DIARY_LOADING: {{ diary.loading }} </span>
    <span> TERMS_LOADING: {{ terms.loading }} </span>
    <span> GRADES_LOADING: {{ grades.loading }} </span>
    <span> CURRENT_TERM: {{ currentTerm }} </span>
    <span> SELECTED_TERM: {{ selectedTerm }}</span>
  </div>
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
import GradesIcon from "@/components/icons/GradesIcon.vue";
import LinearProgress from "@/components/LinearProgress.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
    BaseButton,
    GradesIcon,
    LinearProgress,
  },
  data() {
    return {
      currentTerm: "",
    };
  },
  computed: {
    ...mapGetters({
      terms: "terms/getTerms",
      diary: "diary/getDiary",
      grades: "grades/getGrades",
    }),
    selectedTerm() {
      return this.terms.data.find((item) => item.Id === this.currentTerm);
    },
  },
  watch: {
    currentTerm(value) {
      if (value === "grades") return this.fetchGrades();
      this.fetchDiary(this.selectedTerm);
    },
  },
  methods: {
    ...mapActions({
      logout: "logout",
      fetchTerms: "terms/fetchTerms",
      fetchDiary: "diary/fetchDiary",
      fetchGrades: "grades/fetchGrades",
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
  },
  async created() {
    await this.fetchTerms();
    this.currentTerm = this.terms.data[this.terms.data.length - 1].Id;
  },
};
</script>

<style lang="postcss" scoped>
.nav-bar {
  @apply w-full border-b-2 border-gray-300 dark:border-gray-600-spotify;
}
</style>
