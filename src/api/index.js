/* eslint-disable no-unused-vars */
import axios from "axios";
import $store from "@/store";
import { useToast } from "vue-toastification";
const toast = useToast();

import {
  mockDiary,
  mockTerms,
  mockCaptcha,
  mockUser,
  mockSubject,
  mockGrades,
} from "./mockData.js";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const queryCharacter = config.url.includes("&") ? "&" : "?";
  config.url = `${config.url}${queryCharacter}city=${$store.getters.getCity.value}`;
  return config;
});

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
  // return api.post("login", user);
  return mockUser;
}
export function refreshCaptcha() {
  // return api.get("login/captchaRefresh");
  return mockCaptcha;
}
export function terms() {
  // return api.get("dashboard/terms");
  return mockTerms;
}
export function diary(term) {
  // return api.get(`dashboard/terms/${term}`);
  return mockDiary;
}
export function subject(journalId, evalId) {
  // return api.get(`dashboard/info?journalId=${journalId}&evalId=${evalId}`).then((r) => r.data);
  return mockSubject;
}
export function grades() {
  // return api.get("dashboard/grades").then((response) => response.data);
  return mockGrades;
}
