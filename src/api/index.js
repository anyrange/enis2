import axios from "axios";
import $store from "@/store";
import { useToast } from "vue-toastification";
const toast = useToast();

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

/*
api.interceptors.request.use((config) => {
  const queryCharacter = config.url.includes("&") ? "&" : "?";
  config.url = `${config.url}${queryCharacter}city=${$store.getters.getCity.value}`;
  return config;
});
*/

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.data.status === 401) $store.dispatch("logout");
    toast.error(error?.response?.data?.message || "Что-то пошло не так", {
      timeout: 2500,
      position: "bottom-left",
    });
    return Promise.reject(error);
  }
);

export function login(user) {
  return api.post("login", user);
}
export function refreshCaptcha() {
  return api.get("login/captchaRefresh");
}
export function terms() {
  return api.get("dashboard/terms");
}
export function diary(term) {
  return api.get(`dashboard/terms/${term}`);
}
export function subject(journalId, evalId) {
  return api
    .get(`dashboard/info?journalId=${journalId}&evalId=${evalId}`)
    .then((r) => r.data);
}
export function grades() {
  return api.get("dashboard/grades").then((r) => r.data);
}

/* MOCK */
/* eslint-disable no-useless-escape */
import MockAdapter from "axios-mock-adapter";
import {
  mockDiary,
  mockTerms,
  mockCaptcha,
  mockUser,
  mockSubject,
  mockGrades,
} from "./mockData.js";
const mock = new MockAdapter(api, { delayResponse: 500 });
mock.onPost("login").reply(200, mockUser, {
  status: 200,
});
mock.onGet("login/captchaRefresh").reply(200, mockCaptcha, {
  status: 200,
});
mock.onGet("dashboard/terms").reply(200, mockTerms, {
  status: 200,
});
const termsRegex = new RegExp(`\/terms\/*`);
mock.onGet(termsRegex).reply(200, mockDiary, {
  status: 200,
});
mock.onGet("dashboard/info?journalId=1&evalId=1").reply(200, {
  data: mockSubject,
  status: 200,
});
mock.onGet("dashboard/grades").reply(200, {
  data: mockGrades,
  status: 200,
});
