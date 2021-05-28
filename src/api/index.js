import axios from "axios";
import store from "@/store";
import { Notify } from "quasar";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const queryCharacter = config.url.includes("&") ? "&" : "?";
  config.url = `${config.url}${queryCharacter}city=${store.getters.getCityValue}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    Notify.create({
      color: "negative",
      position: "bottom-left",
      message: error?.response?.data?.message || "Что-то пошло не так",
      progress: true,
      timeout: 1500,
    });
    return Promise.reject(error);
  }
);

export function login(user) {
  return api.post("login", user);
}
export function terms() {
  return api.get("dashboard/terms");
}
export function diary(term) {
  return api.get(`dashboard/terms/${term}`);
}
export function subjectSAU(journalId, evalIdSAU) {
  return api.get(`dashboard/info?journalId=${journalId}&evalId=${evalIdSAU}`);
}
export function subjectSAT(journalId, evalIdSAT) {
  return api.get(`dashboard/info?journalId=${journalId}&evalId=${evalIdSAT}`);
}
