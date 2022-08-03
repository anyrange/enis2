<template>
  <Button
    icon
    aria-label="Toggle GM"
    class="!shadow-transparent !bg-transparent !text-light-50 absolute right-0 top-0"
    :ripple="false"
    @click="GM = !GM"
  >
    <span role="img" aria-label="GodMode" class="text-lg"> 🤔 </span>
  </Button>
  <div class="flex flex-col space-y-2">
    <SubjectDiary :hoverable="false" :subject="subjectType" />
    <LoadingDots v-if="loaderStore.isLoading" />
    <template v-else-if="!subjectStore.subject.customSections.SAU.length">
      <div class="p-2 text-center">
        Не удалось загрузить информацию о предмете.
      </div>
    </template>
    <template v-else>
      <SubjectDiarySection
        type="SAU"
        :data="subjectStore.subject[sectionsType].SAU"
      />
      <SubjectDiarySection
        type="SAT"
        :data="subjectStore.subject[sectionsType].SAT"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import useLoaderStore from "../../../stores/loader";
import useSubjectStore from "../../../stores/subject";
import Button from "../../base/Button.vue";
import LoadingDots from "../../base/loaders/LoadingDots.vue";
import SubjectDiary from "../subject/SubjectDiary.vue";
import SubjectDiarySection from "../subject/SubjectDiarySection.vue";

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
