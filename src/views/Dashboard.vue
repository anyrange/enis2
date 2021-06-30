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
  <section class="flex w-full justify-center p-4">
    <div class="diary-list">
      <!--  -->
      <template v-if="currentTerm !== 'grades'">
        <div
          v-for="subject in currentTermDiary"
          :key="subject"
          class="diary-list-item"
        >
          <div class="flex flex-col flex-grow">
            <div class="text-sm leading-snug">
              {{ subject.Name }}
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-medium">
                {{ subject.Score }}
              </span>
              <linear-progress :value="subject.Score" />
            </div>
          </div>
          <span class="text-right font-semibold text-base">
            {{ subject.Mark }}
          </span>
        </div>
      </template>
      <template v-else>
        GRADES
      </template>
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
.nav-bar {
  @apply w-full border-b-2 border-gray-300 dark:border-gray-600-spotify;
}
.diary-list {
  @apply flex flex-col w-3/5 py-2 divide-y dark:divide-gray-700-spotify rounded-sm dark:bg-gray-800-spotify;
}
.diary-list-item {
  @apply flex flex-row py-2 px-3 gap-3 justify-between items-center cursor-pointer duration-200 hover:bg-gray-100 dark:hover:bg-gray-600-spotify;
}
</style>
