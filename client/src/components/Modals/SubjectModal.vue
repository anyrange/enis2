<template>
  <modal :show="show" @close="emit('close')">
    <template #top-right>
      <base-button
        flat
        icon
        aria-label="Toggle GM"
        class="!shadow-transparent !text-light-50"
        :ripple="false"
        @click="GM = !GM"
      >
        <span role="img" aria-label="GodMode" class="text-lg"> 🤔 </span>
      </base-button>
    </template>
    <div class="flex flex-col space-y-2">
      <subject-diary :hoverable="false" :subject="subjectType" />
      <loading-dots v-if="loaderStore.loading" />
      <template v-else-if="!subjectStore.subject.customSections.SAU.length">
        <div class="p-2 text-center">
          Не удалось загрузить информацию о предмете.
        </div>
      </template>
      <template v-else>
        <subject-diary-sections
          type="SAU"
          :sections="subjectStore.subject[sectionsType].SAU"
        />
        <subject-diary-sections
          type="SAT"
          :sections="subjectStore.subject[sectionsType].SAT"
        />
      </template>
    </div>
  </modal>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useLoader, useSubject } from "@/store";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const loaderStore = useLoader();
const subjectStore = useSubject();

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
