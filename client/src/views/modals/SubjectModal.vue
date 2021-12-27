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
import useSubject from "@/composables/useSubject";
import useLoader from "@/composables/useLoader";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { subject, customSubject, GM } = useSubject();
const { loading, loadingEndpoint, errorMessage } = useLoader();
</script>
