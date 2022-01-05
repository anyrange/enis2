import { computed, ref } from "vue";
import { useStore } from "vuex";
import { refreshCaptcha } from "@/api";
import { notify } from "@/services/notify.js";
import { useRouter } from "vue-router";
import useDebouncedRef from "./useDebouncedRef";

export const useSubject = () => {
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

export const useTerms = () => {
  const store = useStore();
  const { currentYearName, currentTab } = useSettings();

  const actualTermName = computed({
    get: () => store.state.terms.actual,
    set: (value) => {
      store.commit("terms/SET_ACTUAL", value);
    },
  });
  const currentTermId = computed(() =>
    store.getters["terms/getTermId"]({
      termName: currentTab.value,
      yearName: currentYearName.value,
    })
  );
  const terms = computed(() =>
    store.getters["terms/getCurrentTerms"]({
      yearName: currentYearName.value,
    })
  );

  const fetchTerms = (...args) => store.dispatch("terms/fetchTerms", ...args);

  return {
    actualTermName,
    currentTermId,
    terms,
    fetchTerms,
  };
};

export const useYears = () => {
  const store = useStore();
  const { currentYearName } = useSettings();

  const years = computed(() => store.state.years);
  const actualYearName = computed(() => store.state.years.actual);
  const currentYearId = computed(() =>
    store.getters["years/getYearId"](currentYearName.value)
  );

  const fetchYears = (...args) => store.dispatch("years/fetchYears", ...args);

  return {
    years,
    actualYearName,
    currentYearId,
    fetchYears,
  };
};

export const useDiary = () => {
  const store = useStore();
  const { currentYearName, currentTab } = useSettings();

  const diary = computed(() =>
    store.getters["diary/getCurrentDiary"]({
      termName: currentTab.value,
      yearName: currentYearName.value,
    })
  );

  const fetchDiary = (...args) => store.dispatch("diary/fetchDiary", ...args);

  return {
    diary,
    fetchDiary,
  };
};

export const useGrades = () => {
  const store = useStore();
  const { currentYearName } = useSettings();

  const grades = computed(() =>
    store.getters["grades/getCurrentGrades"]({
      yearName: currentYearName.value,
    })
  );

  const fetchGrades = (...args) =>
    store.dispatch("grades/fetchGrades", ...args);

  return {
    grades,
    fetchGrades,
  };
};

export const useHealth = () => {
  const store = useStore();

  const alive = computed({
    get: () => store.state.health.alive,
    set: (value) => {
      store.commit("health/SET_ALIVE", value);
    },
  });

  const showAvailabilityModal = computed({
    get: () => store.state.health.showAvailabilityModal,
    set: (value) => {
      store.commit("health/SET_MODAL", value);
    },
  });

  const checkAvailability = () => store.dispatch("health/checkAvailability");

  return {
    alive,
    showAvailabilityModal,
    checkAvailability,
  };
};

export const useLoader = () => {
  const store = useStore();

  const errorMessage = computed(() => store.getters["loader/errorMessage"]);
  const loading = computed(() => store.getters["loader/isLoading"]);
  const loadingEndpoint = computed(
    () => store.getters["loader/loadingEndpoint"]
  );
  const showLoader = computed(() => store.getters["loader/showLoader"]);

  return {
    loading: useDebouncedRef(loading, 5),
    showLoader: useDebouncedRef(showLoader, 5),
    loadingEndpoint,
    errorMessage,
  };
};

export const useSettings = () => {
  const store = useStore();

  const rememberMe = computed({
    get: () => store.state.preferences.remember,
    set: (value) => {
      store.commit("preferences/SET_REMEMBER", value);
    },
  });
  const darkTheme = computed({
    get: () => store.state.preferences.theme === "dark",
    set: (value) => {
      store.commit("preferences/SET_THEME", value ? "dark" : "light");
    },
  });
  const theme = computed(() => store.state.preferences.theme);
  const sortBy = computed({
    get: () => store.state.preferences.sortBy,
    set: (value) => {
      store.commit("preferences/SET_SORT", value);
    },
  });
  const hideEmpty = computed({
    get: () => store.state.preferences.hideEmpty,
    set: (value) => {
      store.commit("preferences/SET_HIDE", value);
    },
  });
  const currentTab = computed({
    get: () => store.state.preferences.tab,
    set: (value) => {
      store.commit("preferences/SET_TAB", value);
    },
  });
  const currentYearName = computed({
    get: () => store.state.preferences.year,
    set: (value) => {
      store.commit("preferences/SET_YEAR", value);
    },
  });
  const school = computed({
    get: () => store.state.preferences.school,
    set: (value) => {
      store.commit("preferences/SET_SCHOOL", value);
    },
  });

  const setTheme = () => store.dispatch("preferences/setTheme");

  const toggleTheme = () => store.dispatch("preferences/toggleTheme");

  const predictSchool = () => store.dispatch("preferences/predictSchool");

  return {
    rememberMe,
    darkTheme,
    theme,
    sortBy,
    hideEmpty,
    currentTab,
    currentYearName,
    school,
    setTheme,
    predictSchool,
    toggleTheme,
  };
};

export const useAuth = () => {
  const store = useStore();
  const router = useRouter();

  const login = async (...args) => {
    try {
      await store.dispatch("auth/login", ...args);
      router.push({
        name: "dashboard",
      });
    } catch (error) {
      notify.show({
        type: "danger",
        message: error.response.data.message,
      });
      return Promise.reject(error);
    }
  };

  const logout = () => {
    store.dispatch("auth/logout");
    router.push({
      name: "login",
    });
  };

  const captcha = ref("");

  const updateCaptcha = async () => {
    try {
      captcha.value = await refreshCaptcha();
    } catch (error) {
      notify.show({
        type: "danger",
        message: error.response.data.message,
      });
    }
  };

  const authenticated = computed(() => store.getters["auth/authenticated"]);

  const setToken = (...args) => store.commit("auth/SET_TOKEN", ...args);

  return {
    login,
    logout,
    captcha,
    updateCaptcha,
    setToken,
    authenticated,
  };
};
