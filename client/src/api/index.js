import axios from "axios";
import $store from "@/store";
import { notify } from "@/services/notify";

const IPINFO_TOKEN = process.env.VUE_APP_IPINFO_TOKEN;
const isDev = process.env.NODE_ENV === "development";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const savedCity = $store.getters["preferences/getCity"];
  const queryCharacter = config.url.includes("&") ? "&" : "?";
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
export function getTerms() {
  return api.get("dashboard/terms");
}
export function getDiary(id) {
  return api.get(`dashboard/terms/${id}`);
}
export function getSubject(journalId, evalId) {
  return api
    .get(`dashboard/info?journalId=${journalId}&evalId=${evalId}`)
    .then((r) => r.data);
}
export function getGrades() {
  return api.get("dashboard/grades").then((r) => r.data);
}
export function getUserCity() {
  if (isDev) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          city: "Pavlodar",
        });
      }, 300);
    });
  } else {
    return axios
      .get(`https://ipinfo.io/city?token=${IPINFO_TOKEN}`)
      .then((r) => r.data);
  }
}

/* MOCK API */
if (isDev) {
  (async () => {
    const MockAdapter = require("axios-mock-adapter");
    const mocks = require("./mockData.js");
    const mock = new MockAdapter(api, {
      delayResponse: 500,
    });
    mock.onPost("login?city=pvl").reply(200);
    mock.onGet("login/captchaRefresh?city=pvl").reply(200, mocks.mockCaptcha, {
      status: 200,
    });
    mock.onGet("dashboard/terms?city=pvl").reply(200, mocks.mockTerms, {
      status: 200,
    });
    mock.onGet(new RegExp("terms/*")).reply((config) => {
      const match = (id) => config.url.includes(id);
      if (match("term1id")) return [200, mocks.mockDiary[0]];
      if (match("term2id")) return [200, mocks.mockDiary[1]];
      if (match("term3id")) return [200, mocks.mockDiary[2]];
      if (match("term4id")) return [200, mocks.mockDiary[3]];
    });
    mock.onGet("dashboard/info?journalId=1&evalId=1&city=pvl").reply(200, {
      data: mocks.mockSubject,
      status: 200,
    });
    mock.onGet("dashboard/grades?city=pvl").reply(200, {
      data: mocks.mockGrades,
      status: 200,
    });
  })();
}
