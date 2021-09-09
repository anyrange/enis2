import axios from "axios";
import $store from "../store";
import $router from "../router";

const isDev = process.env.NODE_ENV === "development";

const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
    if (error.response.status === 401) {
      $store.dispatch("auth/logout");
      $router.push({ name: "login" });
    }
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
  return api.get("dashboard/subject", {
    params: {
      journalId,
      evalId,
    },
  });
}
export function getGrades() {
  return api.get("dashboard/grades");
}
export function getUserCity() {
  return ipinfo.get("city");
}

//  MOCK API
if (isDev) {
  (async () => {
    const { default: MockAdapter } = await import("axios-mock-adapter");
    const {
      mockCaptcha,
      mockGrades,
      mockYears,
      mockTerms,
      mockDiary,
      mockSubject,
    } = await import("./mockData.js");

    const mock = new MockAdapter(api, { delayResponse: 500 });
    const mockIp = new MockAdapter(ipinfo, { delayResponse: 100 });

    mockIp.onGet("city").reply(200, "Pavlodar");

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
  })();
}
