export const isDev = import.meta.env.DEV;
export const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

const fallbackErrorMessage = "Что-то пошло не так";

export const ENDPOINTS = [
  {
    name: "HEALTH_SMS",
    endpoint: "health/sms",
    hideLoader: false,
    error: fallbackErrorMessage,
  },
  {
    name: "CITY",
    endpoint: "city",
    hideLoader: true,
    error: fallbackErrorMessage,
  },
  {
    name: "LOGIN",
    endpoint: "login",
    hideLoader: false,
    error: "Не удалось войти",
  },
  {
    name: "REFRESH_CAPTCHA",
    endpoint: "login/captchaRefresh",
    hideLoader: true,
    error: "Не удалось загрузить капчу",
  },
  {
    name: "YEARS",
    endpoint: "dashboard/years",
    hideLoader: false,
    error: "Не удалось загрузить года",
  },
  {
    name: "TERMS",
    endpoint: "dashboard/years/",
    hideLoader: false,
    error: "Не удалось загрузить четверти",
  },
  {
    name: "DIARY",
    endpoint: "dashboard/terms/",
    hideLoader: false,
    error: "Не удалось загрузить дневник",
  },
  {
    name: "SUBJECT",
    endpoint: "dashboard/subject",
    hideLoader: true,
    error: "Не удалось загрузить информацию о предмете",
  },
  {
    name: "GRADES",
    endpoint: "dashboard/grades",
    hideLoader: false,
    error: "Не удалось загрузить табель",
  },
];

export const DA_LINK = "https://www.donationalerts.com/r/anyrange";
export const TG_LINK = "https://t.me/joinchat/ToHSvx2gVOBkMzBi";
export const GH_LINK = "https://github.com/anyrange/enis2";
