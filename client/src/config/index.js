export const isDev = import.meta.env.DEV;
export const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8887";

export const DEFAULT_ERROR_MESSAGE = "Что-то пошло не так";

export const ENDPOINTS = Object.freeze([
  {
    name: "HEALTH_SMS",
    endpoint: "health/sms",
    hideLoader: false,
  },
  {
    name: "CITY",
    endpoint: "city",
    hideLoader: true,
  },
  {
    name: "LOGIN",
    endpoint: "login",
    hideLoader: false,
  },
  {
    name: "REFRESH_CAPTCHA",
    endpoint: "login/captchaRefresh",
    hideLoader: true,
  },
  {
    name: "YEARS",
    endpoint: "dashboard/years",
    hideLoader: false,
  },
  {
    name: "TERMS",
    endpoint: "dashboard/years/",
    hideLoader: false,
  },
  {
    name: "DIARY",
    endpoint: "dashboard/terms/",
    hideLoader: false,
  },
  {
    name: "SUBJECT",
    endpoint: "dashboard/subject",
    hideLoader: true,
  },
  {
    name: "GRADES",
    endpoint: "dashboard/grades",
    hideLoader: false,
  },
]);

export const DA_LINK = "https://www.donationalerts.com/r/anyrange";
export const TG_LINK = "https://t.me/joinchat/ToHSvx2gVOBkMzBi";
export const GH_LINK = "https://github.com/anyrange/enis2";
