import { computed } from "vue";
import { useStore } from "vuex";

export default () => {
  const store = useStore();

  const GM = computed({
    get: () => store.state.subject.GM,
    set: (value) => {
      store.commit("subject/SET_GM", value);
    },
  });
  const subject = computed(() => store.state.subject);
  const customSubject = computed(() => store.getters["subject/customSubject"]);
  const fetchSubject = (...args) =>
    store.dispatch("subject/fetchSubject", ...args);

  const clearSubject = () => store.commit("subject/CLEAR_SUBJECT");

  return {
    GM,
    subject,
    customSubject,
    fetchSubject,
    clearSubject,
  };
};
