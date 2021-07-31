import axios from "axios";
import $store from "@/store";
import { notify } from "@/services/notify";

const isDev = process.env.NODE_ENV === "development";

const IPINFO_TOKEN = process.env.VUE_APP_IPINFO_TOKEN;
const SERVER_URL = process.env.VUE_APP_SERVER_URI;

const ipinfo = axios.create({
  baseURL: "https://ipinfo.io",
  headers: {
    Authorization: "Bearer " + IPINFO_TOKEN,
  },
});

ipinfo.interceptors.response.use((response) => {
  return response.data;
});

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (isDev) return config;
  const savedCity = $store.getters["preferences/getCity"];
  const queryCharacter = config.url.includes("?") ? "&" : "?";
  config.url = config.url + queryCharacter + "city=" + savedCity;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    notify.show({
      type: "danger",
      message: error?.response?.data?.message || "Что-то пошло не так",
    });
    if (error.response.data.statusCode === 401) $store.dispatch("auth/logout");
    return Promise.reject(error);
  }
);

export function login(user) {
  return api.post("login", user);
}
export function refreshCaptcha() {
  return api.get("login/captchaRefresh");
}
export function getYears() {
  return api.get("dashboard/years");
}
export function getTermsByYear(yearId) {
  return api.get(`dashboard/years/${yearId}`);
}
export function getDiary(id) {
  return api.get(`dashboard/terms/${id}`);
}
export function getSubject(journalId, evalId) {
  return api.get(`dashboard/subject?journalId=${journalId}&evalId=${evalId}`);
}
export function getGrades() {
  return api.get("dashboard/grades");
}
export function getUserCity() {
  return ipinfo.get("city");
}

/* MOCK API */
if (isDev) {
  (async () => {
    const MockAdapter = require("axios-mock-adapter");
    const mocks = require("./mockData.js");

    const mockIp = new MockAdapter(ipinfo, { delayResponse: 100 });
    mockIp.onGet(new RegExp("city")).reply(200, { city: "Pavlodar" });

    const mock = new MockAdapter(api, { delayResponse: 500 });
    mock.onPost("login").reply(200);
    mock.onGet("captchaRefresh").reply(200, mocks.mockCaptcha);
    mock.onGet("dashboard/years").reply(200, mocks.mockYears);
    mock.onGet("dashboard/grades").reply(200, mocks.mockGrades);
    mock.onGet(new RegExp("subject")).reply(200, mocks.mockSubject);
    mock.onGet(new RegExp("years/*")).reply(200, mocks.mockTerms);
    mock.onGet(new RegExp("terms/*")).reply((config) => {
      const match = (id) => config.url.includes(id);
      if (match("term1id")) return [200, mocks.mockDiary[0]];
      if (match("term2id")) return [200, mocks.mockDiary[1]];
      if (match("term3id")) return [200, mocks.mockDiary[2]];
      if (match("term4id")) return [200, mocks.mockDiary[3]];
    });
  })();
}
