import { computed, ref } from "vue";
import { useStore } from "vuex";
import { refreshCaptcha } from "@/api";
import { notify } from "@/services/notify.js";
import { useRouter } from "vue-router";

export default () => {
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

  const saveAccount = (...args) => store.commit("auth/SET_ACCOUNT", ...args);

  const savedAccount = computed(() => store.state.auth.savedAccount);

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
    savedAccount,
    saveAccount,
    updateCaptcha,
    setToken,
    authenticated,
  };
};
