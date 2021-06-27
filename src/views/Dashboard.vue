<template>
  <q-header
    bordered
    :class="$q.dark.isActive ? 'header_dark' : 'header_normal'"
    v-if="!loadingTerms"
  >
    <q-tabs
      v-model="current_term"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab
        v-for="(term, index) in terms"
        :key="index"
        :label="getTermLable(index + 1)"
        :name="term.Name"
        :ripple="false"
        @click="getDiary(term)"
      />
      <q-tab
        name="grades"
        icon="table_view"
        :ripple="false"
        @click="getGrades()"
      />
    </q-tabs>
  </q-header>
  <q-page-container v-if="!loading">
    <q-page class="flex flex-center">
      <q-card class="lg:w-1/3 xl:w-1/4" flat>
        <q-list bordered separator v-if="current_term !== 'grades'">
          <q-item
            v-for="subject in currentTermMarks"
            :key="subject"
            class="q-my-sm"
            clickable
            @click="selectSubject(subject)"
          >
            <q-item-section>
              <q-item-label>{{ subject.Name }}</q-item-label>
              <q-item-label class="text-subtitle2">
                {{ subject.Score }}%
              </q-item-label>
              <q-linear-progress
                :value="subject.Score / 100"
                rounded
                :color="getStrengthColor(subject.Score)"
                class="q-mt-sm"
              />
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-weight-bold">
                {{ subject.Mark }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else>
          <q-item v-for="item in grades" :key="item.SubjectName">
            <q-card
              style="border-radius: 10px; width: 100%"
              :class="{ 'grade-card-mobile': !$q.screen.gt.sm }"
              flat
              bordered
            >
              <q-card-section>
                <div class="row justify-between">
                  <div class="col">
                    <div
                      class="text-h5 text-weight-medium"
                      style="display: inline-block;width: 100%;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"
                    >
                      {{ item.SubjectName }}
                    </div>
                  </div>
                  <div class="col">
                    <div class="row justify-end q-gutter-md">
                      <div v-if="item.Exam !== 'none'">
                        <div class="column items-center">
                          <div class="col">
                            <div class="text-h5 text-weight-medium">5</div>
                          </div>
                          <div class="col">
                            <div class="text-h7">Экзамен</div>
                          </div>
                        </div>
                      </div>
                      <div v-if="item.Final !== 'none'">
                        <div class="column items-center">
                          <div class="col">
                            <div class="text-h5 text-weight-medium">
                              {{ item.Final }}
                            </div>
                          </div>
                          <div class="col">
                            <div class="text-h7">Итоговая</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="q-mt-lg">
                  <div class="row justify-between">
                    <template v-if="item.FirstHalfYear === 'none'">
                      <div class="column items-center">
                        <div class="text-subtitle2">I</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.FirstPeriod) }}
                        </div>
                      </div>
                      <div class="column items-center">
                        <div class="text-subtitle2">II</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.SecondPeriod) }}
                        </div>
                      </div>
                      <div class="column items-center">
                        <div class="text-subtitle2">III</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.ThirdPeriod) }}
                        </div>
                      </div>
                      <div class="column items-center">
                        <div class="text-subtitle2">IV</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.ForthPeriod) }}
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="column items-center">
                        <div class="text-subtitle2">I и II</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.FirstHalfYear) }}
                        </div>
                      </div>
                      <div class="column items-center">
                        <div class="text-subtitle2">III и IV</div>
                        <div class="text-subtitle1">
                          {{ formatScore(item.SecondHalfYear) }}
                        </div>
                      </div>
                    </template>
                    <div class="column items-center">
                      <div class="text-subtitle2">
                        Годовая
                      </div>
                      <div class="text-subtitle1">
                        {{ formatScore(item.Year) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-item>
        </q-list>
      </q-card>
      <q-dialog v-model="modalOpened" @hide="selectedSubject = {}">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-tabs
            v-model="subjectTab"
            align="justify"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab name="sau" label="СОР" />
            <q-tab name="sat" label="СОЧ" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="subjectTab" animated>
            <q-tab-panel name="sau">
              <q-list separator>
                <q-item
                  v-for="item in selectedSubject.SAU"
                  :key="item.RubricId"
                  class="q-my-sm"
                >
                  <q-item-section>
                    <q-item-label>{{ item.Name }}</q-item-label>
                    <q-linear-progress
                      :value="item.Score / item.MaxScore"
                      rounded
                      :color="
                        getStrengthColor((item.Score / item.MaxScore) * 100)
                      "
                      class="q-mt-sm"
                    />
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold">
                      {{ item.Score }} / {{ item.MaxScore }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="sat">
              <q-list separator>
                <q-item
                  v-for="item in selectedSubject.SAT"
                  :key="item.RubricId"
                  class="q-my-sm"
                >
                  <q-item-section>
                    <q-item-label>{{ item.Name }}</q-item-label>
                    <q-linear-progress
                      :value="item.Score / item.MaxScore"
                      rounded
                      :color="
                        getStrengthColor((item.Score / item.MaxScore) * 100)
                      "
                      class="q-mt-sm"
                    />
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold">
                      {{ item.Score }} / {{ item.MaxScore }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-dialog>
    </q-page>
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-btn
        color="red"
        icon="logout"
        label="Выйти"
        rounded
        @click="logout()"
      />
    </q-page-sticky>
  </q-page-container>
</template>

<script>
import { mapActions } from "vuex";
import { terms, diary, subject, grades } from "@/api";

export default {
  data() {
    return {
      loading: true,
      loadingTerms: true,
      diary: [],
      grades: [],
      terms: [],
      current_term: "",
      modalOpened: false,
      subjectTab: "sau",
      selectedSubject: {
        empty: false,
        SAU: {},
        SAT: {},
      },
    };
  },
  computed: {
    currentTermMarks() {
      return this.diary.find((t) => this.current_term === t.termName).data;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    disconnect() {
      this.$q.loading.hide();
    },
    chooseTerm(termName) {
      this.current_term = termName;
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
    getStrengthColor(score) {
      const roundedScore = Math.ceil(score);
      if (roundedScore >= 85) return "positive";
      if (roundedScore >= 65) return "warning";
      return "negative";
    },
    getTermLable(index) {
      switch (index) {
        case 1:
          return "I";
        case 2:
          return "II";
        case 3:
          return "III";
        case 4:
          return "IV";
        default:
          break;
      }
    },
    async fetchTerms() {
      try {
        this.terms = await terms();
        this.getDiary(this.terms[this.terms.length - 1]);
        this.loadingTerms = false;
      } catch (error) {
        console.log(error);
        this.disconnect();
      }
    },
    async getDiary(term) {
      const id = term.Id;
      const termName = term.Name;

      if (this.diary.find((term) => termName === term.termName))
        return this.chooseTerm(termName);

      this.$q.loading.show();
      this.loading = true;
      try {
        const response = await diary(id);
        this.diary.push({
          termName: termName,
          data: response.data,
        });
        console.log("diary:", this.diary);
        this.chooseTerm(termName);
      } catch {
        this.disconnect();
      } finally {
        this.loading = false;
        this.$q.loading.hide();
      }
    },
    async selectSubject(subj) {
      this.modalOpened = true;
      if (!subj.Evaluations[0]?.Id || !subj.Evaluations[1]?.Id) {
        return (this.selectedSubject.empty = true);
      }
      try {
        this.selectedSubject.SAU = await subject(
          subj.JournalId,
          subj.Evaluations[0].Id
        );
        this.selectedSubject.SAT = await subject(
          subj.JournalId,
          subj.Evaluations[1].Id
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getGrades() {
      if (!this.grades.length) {
        this.$q.loading.show();
        this.grades = await grades();
        this.$q.loading.hide();
      }
    },
  },
  created() {
    this.$q.loading.show();
    this.fetchTerms();
  },
  watch: {
    diary() {
      console.log("diary: ", this.diary);
    },
    grades() {
      console.log("grades: ", this.grades);
    },
    terms() {
      console.log("terms: ", this.terms);
    },
  },
};
</script>

<style>
.header_normal {
  background: #fff;
}
.header_dark {
  background: #1d1d1d;
}
.grade-card-mobile {
  max-width: 350px;
}
</style>
