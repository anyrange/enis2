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
      <subject-diary
        :hoverable="false"
        :subject="GM ? customSubject : subject.originalSubject"
      />
      <loading-dots v-if="loading" />
      <template
        v-else-if="
          !subject.customSections.SAU.length &&
          !loading &&
          loadingEndpoint === 'SUBJECT'
        "
      >
        <div class="p-2 text-center">
          {{ errorMessage }}
        </div>
      </template>
      <template v-else>
        <subject-sections
          label="СОР"
          :subject="
            GM ? subject.customSections.SAU : subject.originalSections.SAU
          "
        />
        <subject-sections
          label="СОЧ"
          :subject="
            GM ? subject.customSections.SAT : subject.originalSections.SAT
          "
        />
      </template>
    </div>
  </modal>
</template>

<script setup>
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

const { loading, loadingEndpoint, errorMessage } = storeToRefs(loaderStore);
const { subject, customSubject, GM } = storeToRefs(subjectStore);
</script>
