import axios from "axios";
import $store from "../store";
import { isDev, ENDPOINTS } from "../settings";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    $store.commit("loader/SET_LOADING", {
      status: true,
      endpoint: ENDPOINTS.find((e) => config.url.includes(e.endpoint)).name,
    });
    config.params = {
      ...config.params,
      city: $store.state.preferences.school,
    };
    return config;
  },
  (error) => {
    $store.commit("loader/SET_LOADING", {
      status: false,
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    $store.commit("loader/SET_LOADING", {
      status: false,
    });
    return response.data;
  },
  async (error) => {
    $store.commit("loader/SET_LOADING", {
      status: false,
    });
    error.response.data = error.response.data || {};
    error.response.data.message =
      error.response.data.message || "Что-то пошло не так";
    return Promise.reject(error);
  }
);

const getEndpoint = (name) => {
  return ENDPOINTS.find((e) => e.name === name).endpoint;
};

export const checkSMSavailability = () => api.get(getEndpoint("HEALTH_SMS"));

export const getUserCity = () =>
  api.get(getEndpoint("CITY"), { timeout: 1500 });

export const login = (user) => api.post(getEndpoint("LOGIN"), user);

export const refreshCaptcha = () => api.get(getEndpoint("REFRESH_CAPTCHA"));

export const getYears = () => api.get(getEndpoint("YEARS"));

export const getTerms = (id) => api.get(`${getEndpoint("TERMS")}${id}`);

export const getDiary = (id) => api.get(`${getEndpoint("DIARY")}${id}`);

export const getSubject = (journalId, evalId) =>
  api.get(getEndpoint("SUBJECT"), {
    params: { journalId, evalId },
  });

export const getGrades = (yearID) =>
  api.get(getEndpoint("GRADES"), { params: { yearID } });

if (isDev) {
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

  mock.onGet("health/sms").reply(200, { alive: true });

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
}
