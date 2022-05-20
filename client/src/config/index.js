export const isDev = import.meta.env.DEV;
export const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const DEFAULT_ERROR_MESSAGE = "Что-то пошло не так";

export const ENDPOINTS = Object.freeze([
  {
    name: "HEALTH_SMS",
    endpoint: "health/sms",
    loader: "overlay",
  },
  {
    name: "CITY",
    endpoint: "city",
    loader: "hide",
  },
  {
    name: "LOGIN",
    endpoint: "login",
    loader: "overlay",
  },
  {
    name: "REFRESH_CAPTCHA",
    endpoint: "login/captchaRefresh",
    loader: "overlay",
  },
  {
    name: "YEARS",
    endpoint: "dashboard/years",
    loader: "overlay",
  },
  {
    name: "TERMS",
    endpoint: "dashboard/terms/",
    loader: "overlay",
  },
  {
    name: "DIARY",
    endpoint: "dashboard/diary/",
    loader: "optional",
  },
  {
    name: "SUBJECT",
    endpoint: "dashboard/subject",
    loader: "hide",
  },
  {
    name: "GRADES",
    endpoint: "dashboard/grades",
    loader: "optional",
  },
]);

export const DA_LINK = "https://www.donationalerts.com/r/anyrange";
export const TG_LINK = "https://t.me/joinchat/ToHSvx2gVOBkMzBi";
export const GH_LINK = "https://github.com/anyrange/enis2";

export const DEFAULT_RANGES = [0, 40, 65, 85, 100];
