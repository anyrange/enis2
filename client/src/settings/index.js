export const isDev = import.meta.env.DEV;

export const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const ENDPOINTS = {
  HEALTH_SMS: "health/sms",
  CITY: "city",
  LOGIN: "login",
  REFRESH_CAPTCHA: "login/captchaRefresh",
  SUBJECT: "dashboard/subject",
  YEARS: "dashboard/years",
  TERMS: "dashboard/years/",
  DIARY: "dashboard/terms/",
  GRADES: "dashboard/grades",
};

export const HIDE_LOADER_ON_ENDPOINTS = ["CITY", "REFRESH_CAPTCHA", "SUBJECT"];
