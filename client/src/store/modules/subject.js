import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { getSubject } from "@/api";
import { getScore } from "@/utils";

export default defineStore("subject", () => {
  const initialState = {
    customSections: {
      SAU: [],
      SAT: [],
    },
    originalSections: {
      SAU: [],
      SAT: [],
    },
    originalSubject: {},
  };
  const subject = reactive({ ...initialState });
  const GM = ref(false);

  const customSubject = computed(() => {
    return {
      ...subject.originalSubject,
      Score: getScore(subject.customSections.SAU, subject.customSections.SAT),
    };
  });

  const clearSubject = () => {
    Object.assign(subject, initialState);
    GM.value = false;
  };

  const fetchSubject = async (subj) => {
    subject.originalSubject = subj;
    try {
      const sections = {
        SAU: await getSubject(subj.JournalId, subj.Evaluations[0]),
        SAT: await getSubject(subj.JournalId, subj.Evaluations[1]),
      };
      subject.originalSections = sections;
      subject.customSections = JSON.parse(JSON.stringify(sections));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    subject,
    GM,
    customSubject,
    fetchSubject,
    clearSubject,
  };
});
