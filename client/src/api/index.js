import axios from "axios";
import $store from "../store";
import { notify } from "../services/notify";
import { isDev } from "../settings";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    city: $store.getters["preferences/getSchool"],
  };
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (!$store.getters["preferences/getRemember"]) return logout(error);
      try {
        await $store.dispatch(
          "auth/login",
          $store.getters["auth/getCredentials"]
        );
        return api.request(error.config);
      } catch (error) {
        return logout(error);
      }
    }
    return Promise.reject(error);
  }
);

const logout = (error) => {
  $store.dispatch("auth/logout");
  notify.show({
    type: "danger",
    message: error.response.data.message,
  });
};

export const getUserCity = () => api.get("city", { timeout: 1500 });

export const login = (user) => api.post("login", user);
export const refreshCaptcha = () => api.get("login/captchaRefresh");

export const getYears = () => api.get("dashboard/years");
export const getTerms = (yearId) => api.get(`dashboard/years/${yearId}`);
export const getDiary = (id) => api.get(`dashboard/terms/${id}`);
export const getSubject = (journalId, evalId) => {
  return api.get("dashboard/subject", {
    params: {
      journalId,
      evalId,
    },
  });
};
export const getGrades = (yearID) => {
  return api.get("dashboard/grades", {
    params: {
      yearID,
    },
  });
};

if (isDev) {
  (async () => {
    try {
      const { default: MockAdapter } = await import("axios-mock-adapter");
      const {
        mockCaptcha,
        mockGrades,
        mockYears,
        mockTerms,
        mockDiary,
        mockSubject,
      } = await import("./mockData.js");

      const mock = new MockAdapter(api, { delayResponse: 300 });

      mock.onGet("city").reply(200, { city: "Pavlodar" });

      mock.onPost("login").reply(200);
      mock.onGet("login/captchaRefresh").reply(200, mockCaptcha);
      mock.onGet("dashboard/grades").reply(200, mockGrades);
      mock.onGet("dashboard/years").reply(200, mockYears);
      mock.onGet(new RegExp("years/*")).reply(200, mockTerms);
      mock.onGet(new RegExp("terms/*")).reply((config) => {
        const match = (id) => config.url.includes(id);
        if (match("term1id")) return [200, mockDiary[0]];
        if (match("term2id")) return [200, mockDiary[1]];
        if (match("term3id")) return [200, mockDiary[2]];
        if (match("term4id")) return [200, mockDiary[3]];
      });
      mock.onGet(new RegExp("subject")).reply(200, mockSubject);
    } catch (error) {
      console.error("Mock API: " + error);
    }
  })();
}
