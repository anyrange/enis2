import { computed } from "vue";
import { useStore } from "vuex";
import useDebouncedRef from "./useDebouncedRef";

export default () => {
  const store = useStore();

  const errorMessage = computed(() => store.getters["loader/errorMessage"]);
  const loadingStatus = computed(() => store.state.loader.status);
  const loadingEndpoint = computed(() => store.state.loader.endpoint);
  const loader = computed(() => store.getters["loader/showLoader"]);

  const loading = useDebouncedRef(loadingStatus, 5);
  const showLoader = useDebouncedRef(loader, 5);

  return {
    loading,
    loadingEndpoint,
    errorMessage,
    showLoader,
  };
};
