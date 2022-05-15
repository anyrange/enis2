import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { login as _login, refreshCaptcha } from "@/api";
import { notify } from "@/services/notify.js";
import useYearsStore from "./years.js";
import useTermsStore from "./terms.js";
import useDiaryStore from "./diary.js";
import useGradesStore from "./grades.js";
import useSettingsStore from "./settings.js";
import useSubjectStore from "./subject.js";

export default defineStore("auth", () => {
  const { clearYears } = useYearsStore();
  const { clearTerms } = useTermsStore();
  const { clearDiary } = useDiaryStore();
  const { clearGrades } = useGradesStore();
  const { clearSettings } = useSettingsStore();
  const { clearSubject } = useSubjectStore();

  const token = useStorage("token", "");
  const authenticated = useStorage("authenticated", false);

  const captcha = ref(null);

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
      const data = await _login(credentials);
      setToken(data.token);
      captcha.value = null;
      authenticated.value = true;
    } catch (error) {
      authenticated.value = false;
      setToken(error.response.data.token);
      notify.show({
        type: "danger",
        message: error.response.data.message,
      });
      return Promise.reject(error);
    }
  };
  const logout = () => {
    token.value = null;
    authenticated.value = false;
    clearStore();
  };
  const updateCaptcha = async () => {
    try {
      captcha.value = await refreshCaptcha();
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
