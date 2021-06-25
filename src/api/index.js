import axios from "axios";
import $store from "@/store";
import { useToast } from "vue-toastification";
const toast = useToast();
import mockDiary from "./mockDiary.js";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const queryCharacter = config.url.includes("&") ? "&" : "?";
  config.url = `${config.url}${queryCharacter}city=${$store.getters.getCityValue}`;
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
      icon: false,
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
  return [
    { Id: "grade1id", Name: "1 четверть" },
    { Id: "grade2id", Name: "2 четверть" },
    { Id: "grade3id", Name: "3 четверть" },
    { Id: "grade4id", Name: "4 четверть" },
  ];
  // return api.get("dashboard/terms");
}
export function diary(term) {
  console.log(term);
  return mockDiary;
  // return api.get(`dashboard/terms/${term}`);
}
export function subject(journalId, evalId) {
  console.log(journalId, evalId);
  // return api
  //   .get(`dashboard/info?journalId=${journalId}&evalId=${evalId}`)
  //   .then((response) => response.data);
}
export function grades() {
  // return api.get("dashboard/grades").then((response) => response.data);
}
