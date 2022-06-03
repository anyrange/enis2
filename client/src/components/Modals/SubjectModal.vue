<template>
  <base-button
    icon
    aria-label="Toggle GM"
    class="!shadow-transparent !bg-transparent !text-light-50 absolute right-0 top-0"
    :ripple="false"
    @click="GM = !GM"
  >
    <span role="img" aria-label="GodMode" class="text-lg"> 🤔 </span>
  </base-button>
  <div class="flex flex-col space-y-2">
    <subject-diary :hoverable="false" :subject="subjectType" />
    <loading-dots v-if="loaderStore.isLoading" />
    <template v-else-if="!subjectStore.subject.customSections.SAU.length">
      <div class="p-2 text-center">
        Не удалось загрузить информацию о предмете.
      </div>
    </template>
    <template v-else>
      <subject-diary-section
        type="SAU"
        :data="subjectStore.subject[sectionsType].SAU"
      />
      <subject-diary-section
        type="SAT"
        :data="subjectStore.subject[sectionsType].SAT"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import useLoaderStore from "@/stores/loader";
import useSubjectStore from "@/stores/subject";

const loaderStore = useLoaderStore();
const subjectStore = useSubjectStore();

const { GM } = storeToRefs(subjectStore);

const sectionsType = computed(() => {
  return GM.value ? "customSections" : "originalSections";
});
const subjectType = computed(() => {
  return GM.value
    ? subjectStore.customSubject
    : subjectStore.subject.originalSubject;
});
</script>
