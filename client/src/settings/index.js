export const isDev = process.env.NODE_ENV === "development";

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

export const HIDE_LOADER_ON_ENDPOINTS = [
  "CITY",
  "LOGIN",
  "REFRESH_CAPTCHA",
  "SUBJECT",
];
