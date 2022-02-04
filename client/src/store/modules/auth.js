import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { login as _login, refreshCaptcha } from "@/api";
import { isEmpty } from "@/utils";
import { notify } from "@/services/notify.js";
import useYearsStore from "./years.js";
import useTermsStore from "./terms.js";
import useDiaryStore from "./diary.js";
import useGradesStore from "./grades.js";
import useSettingsStore from "./settings.js";
import useSubjectStore from "./subject.js";

export default defineStore("auth", () => {
  const router = useRouter();

  const { clearYears } = useYearsStore();
  const { clearTerms } = useTermsStore();
  const { clearDiary } = useDiaryStore();
  const { clearGrades } = useGradesStore();
  const { clearSettings } = useSettingsStore();
  const { clearSubject } = useSubjectStore();

  const token = ref(null);
  const captcha = ref(null);

  const authenticated = computed(() => !isEmpty(token.value));

  const clearStore = () => {
    clearYears();
    clearTerms();
    clearDiary();
    clearGrades();
    clearSettings();
    clearSubject();
  };

  const setToken = (newToken) => {
    token.value = newToken;
  };
  const login = async (credentials) => {
    try {
      await _login(credentials);
      captcha.value = null;
      router.push({ name: "dashboard" });
    } catch (error) {
      notify.show({
        type: "danger",
        message: error.response.data.message,
      });
      return Promise.reject(error);
    }
  };
  const logout = () => {
    token.value = null;
    router.push({ name: "login" });
    clearStore();
  };
  const updateCaptcha = async () => {
    try {
      captcha.value = refreshCaptcha();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return {
    token,
    captcha,
    authenticated,
    login,
    logout,
    updateCaptcha,
    setToken,
  };
});
