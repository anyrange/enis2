<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh">
    <template v-if="!loadingTerms">
      <q-header bordered class="bg-white text-primary">
        <q-tabs
          v-model="current_term"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            v-for="(term, index) in terms"
            :key="index"
            :label="`${index + 1} Четверть`"
            :name="term.Name"
            :ripple="false"
            @click="getDiary(term)"
          />
        </q-tabs>
      </q-header>
    </template>
    <template v-if="!loading">
      <q-page-container>
        <q-page class="flex flex-center">
          <q-card class="lg:w-1/3 xl:w-1/4" flat>
            <q-list bordered separator>
              <q-item
                v-for="subject in sortByScore(marks.data)"
                :key="subject.Id"
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
                <q-tab name="sor" label="СОР" />
                <q-tab name="soch" label="СОЧ" />
              </q-tabs>
              <q-separator />
              <q-tab-panels v-model="subjectTab" animated>
                <q-tab-panel name="sor">
                  <q-list separator>
                    <q-item
                      v-for="item in selectedSubject.SOR"
                      :key="item.RubricId"
                      class="q-my-sm"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.Name }}</q-item-label>
                        <q-linear-progress
                          :value="item.Score / item.MaxScore"
                          rounded
                          :color="
                            getStrengthColorScore(item.Score / item.MaxScore)
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
                <q-tab-panel name="soch">
                  <q-list separator>
                    <q-item
                      v-for="item in selectedSubject.SOCH"
                      :key="item.RubricId"
                      class="q-my-sm"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.Name }}</q-item-label>
                        <q-linear-progress
                          :value="item.Score / item.MaxScore"
                          rounded
                          :color="
                            getStrengthColorScore(item.Score / item.MaxScore)
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
                  </q-list></q-tab-panel
                >
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
            @click="disconnect()"
          />
        </q-page-sticky>
      </q-page-container>
    </template>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import api from "@/api";

export default {
  data() {
    return {
      loading: true,
      loadingTerms: true,

      marks: null,
      modalOpened: false,
      subjectTab: "sor",
      selectedSubject: {},
      terms: "",
      current_term: "",
      diary: [],
    };
  },
  methods: {
    ...mapActions(["logout"]),
    disconnect() {
      this.logout();
      this.$router.push({ name: "login" });
    },
    selectSubject(subj) {
      this.modalOpened = true;
      api
        .subject(subj.JournalId, subj.Evaluations[0].Id, subj.Evaluations[1].Id)
        .then((response) => {
          this.selectedSubject.SOR = response[0].data.data;
          this.selectedSubject.SOCH = response[1].data.data;
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: error.response.data.message,
            progress: true,
            timeout: 1500,
          });
          this.disconnect();
        });
    },
    sortByScore(array) {
      return array.sort((a, b) => {
        return b.Score - a.Score;
      });
    },
    getStrengthColor(score) {
      const roundedScore = Math.ceil(score);
      if (roundedScore >= 85) return "positive";
      if (roundedScore >= 65) return "warning";
      return "negative";
    },
    getStrengthColorScore(score) {
      score = score * 100;
      const roundedScore = Math.ceil(score);
      if (roundedScore >= 85) return "positive";
      if (roundedScore >= 65) return "warning";
      return "negative";
    },
    chooseTerm(termName) {
      this.marks = this.diary.find((term) => termName === term.termName);
      this.current_term = termName;
    },
    fetchTerms() {
      api
        .terms()
        .then((response) => {
          this.terms = response;
          this.getDiary(this.terms[this.terms.length - 1]);
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: error.response.data.message,
            progress: true,
            timeout: 1500,
          });
          this.disconnect();
          this.$q.loading.hide();
        })
        .finally(() => {
          this.loadingTerms = false;
        });
    },
    getDiary(term) {
      const id = term.Id;
      const termName = term.Name;

      if (this.diary.find((term) => termName === term.termName))
        return this.chooseTerm(termName);

      this.$q.loading.show();
      this.loading = true;

      api
        .diary(id)
        .then((response) => {
          this.diary.push({
            termName: termName,
            data: response.data,
          });
          this.chooseTerm(termName);
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: error.response.data.message,
            progress: true,
            timeout: 1500,
          });
          this.disconnect();
          this.$q.loading.hide();
        })
        .finally(() => {
          this.loading = false;
          this.$q.loading.hide();
        });
    },
  },
  created() {
    this.$q.loading.show();
    this.fetchTerms();
  },
};
</script>
