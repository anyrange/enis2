<template>
  <q-page class="flex flex-center">
    <template v-if="!loading">
      <q-header reveal>
        <q-tabs v-model="term" inline-label>
          <q-tab
            v-for="(term, index) in dash.length"
            :key="index"
            :label="`${index + 1} Term`"
            :name="`${index + 1}_term`"
            :ripple="false"
            @click="selectTerm(index)"
          />
        </q-tabs>
      </q-header>
      <q-card class="lg:w-1/3 xl:w-1/4" flat>
        <q-list bordered>
          <q-item
            v-for="subject in sortByScore(marks.data)"
            :key="subject.Id"
            class="q-my-sm"
            clickable
          >
            <q-item-section>
              <q-item-label>{{ subject.Name }}</q-item-label>
              <q-item-label caption lines="1">
                {{ subject.Score }}
              </q-item-label>
              <q-linear-progress
                :value="subject.Score / 100"
                rounded
                :color="getStrengthColor(subject.Score)"
                class="q-mt-sm"
              />
            </q-item-section>
            <q-item-section side>
              <q-item-label> {{ subject.Mark }} </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-btn
        color="red"
        icon="logout"
        label="Logout"
        rounded
        @click="disconnect()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import api from "@/api";

export default {
  data() {
    return {
      loading: true,
      dash: [],
      term: "",
      marks: null,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    disconnect() {
      this.logout();
      this.$router.push({ name: "login" });
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
    selectTerm(term) {
      this.marks = this.dash[term];
    },
  },
  created() {
    this.$q.loading.show();
    api
      .deshboard()
      .then((response) => {
        console.log(response.data);
        this.dash = response.data;
        this.term = `${this.dash.length}_term`;
        this.selectTerm(this.dash.length - 1);
      })
      .catch((error) => {
        this.$q.notify({
          color: "negative",
          position: "bottom-left",
          message: error.response.data.message,
          progress: true,
          timeout: 1500,
        });
      })
      .finally(() => {
        this.loading = false;
        this.$q.loading.hide();
      });
  },
};
</script>
