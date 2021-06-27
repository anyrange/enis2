<template>
  <nav
    class="w-full border-b-2 border-gray-300-spotify dark:border-gray-600-spotify"
  >
    <tabs v-if="!loadingTerms" v-model="currentTerm">
      <!-- <tab
        v-for="(term, index) in terms"
        :key="term"
        :name="term.Name"
        @click="getDiary(term)"
      >
        {{ getTermLable(index + 1) }}
      </tab> -->

      <tab name="1">I</tab>
      <tab name="2">II</tab>
      <tab name="3">III</tab>
      <tab name="4">IV</tab>

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
/* eslint-disable no-unused-vars */
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import BaseButton from "@/components/BaseButton.vue";
import TabelIcon from "@/components/icons/TabelIcon.vue";
import LinearProgress from "@/components/LinearProgress.vue";
import { mapActions, mapGetters } from "vuex";
// import { terms, diary, subject, grades } from "@/api";

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
      currentTerm: "4",
    };
  },
  computed: {
    ...mapGetters({
      terms: "terms/getTerms",
      loadingTerms: "terms/getLoading",
    }),
  },
  methods: {
    ...mapActions({
      logout: "logout",
      fetchTerms: "terms/fetchTerms",
    }),
  },
  created() {
    this.fetchTerms();
  },
};
</script>
