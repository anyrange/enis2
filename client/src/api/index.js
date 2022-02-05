import axios from "axios";
import { isMock, ENDPOINTS, SERVER_URL, fallbackErrorMessage } from "@/config";
import { useLoader, useAuth, useSettings } from "@/store";

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

const setLoader = ({ status, endpoint }) => {
  const loader = useLoader();
  loader.setLoader({ status, endpoint });
};

const setToken = (token) => {
  if (!token) return;
  const auth = useAuth();
  auth.setToken(token);
};

api.interceptors.request.use(
  (config) => {
    const endpintName = ENDPOINTS.find((e) => {
      return config.url.includes(e.endpoint);
    }).name;
    setLoader({
      status: "loading",
      endpoint: endpintName,
    });
    const authStore = useAuth();
    const settingsStore = useSettings();
    config.params = {
      ...config.params,
      city: settingsStore.settings.school,
      token: authStore.token,
    };
    if (isMock) {
      console.log(`🚀 endpoint: ${endpintName}, url: ${config.url}`);
    }
    return config;
  },
  (error) => {
    setLoader({ status: "error", endpoint: null });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    setLoader({ status: "pending", endpoint: null });
    setToken(response?.data?.token);
    return response.data;
  },
  (error) => {
    setLoader({ status: "error", endpoint: null });
    setToken(error.response?.data?.token);
    error.response.data = error.response.data || {};
    error.response.data.message =
      error.response.data.message || fallbackErrorMessage;
    return Promise.reject(error);
  }
);

const getEndpoint = (name) => {
  return ENDPOINTS.find((e) => e.name === name).endpoint;
};

export const checkHealth = () => api.get(getEndpoint("HEALTH_SMS"));

export const getUserCity = () =>
  api.get(getEndpoint("CITY"), { timeout: 1500 });

export const login = (user) => api.post(getEndpoint("LOGIN"), user);

export const refreshCaptcha = () => api.get(getEndpoint("REFRESH_CAPTCHA"));

export const getYears = () => api.get(getEndpoint("YEARS"));

export const getTerms = (id) => api.get(`${getEndpoint("TERMS")}${id}`);

export const getDiary = (id) => api.get(`${getEndpoint("DIARY")}${id}`);

export const getSubject = (journalId, evalId) =>
  api.get(getEndpoint("SUBJECT"), {
    params: { journalId, evalId },
  });

export const getGrades = (yearID) =>
  api.get(getEndpoint("GRADES"), { params: { yearID } });

export const installMockApi = async (api) => {
  const { default: MockAdapter } = await import("axios-mock-adapter");
  const {
    mockCaptcha,
    mockGrades,
    mockYears,
    mockTerms,
    mockDiary,
    mockSubject,
  } = await import("./mockData.js");

  const mock = new MockAdapter(api, { delayResponse: 300 });

  mock.onGet("health/sms").reply(200, { alive: true });

  mock.onGet("city").reply(200, { city: "Pavlodar" });

  const token = "mock.token";

  mock.onPost("login").reply(200, { token });
  mock.onGet("login/captchaRefresh").reply(200, mockCaptcha);
  mock.onGet("dashboard/grades").reply(200, mockGrades);
  mock.onGet("dashboard/years").reply(200, mockYears);
  mock.onGet(new RegExp("years/*")).reply(200, mockTerms);
  mock.onGet(new RegExp("terms/*")).reply((config) => {
    const match = (id) => config.url.includes(id);
    if (match("term1id")) return [200, { data: mockDiary[0], token }];
    if (match("term2id")) return [200, { data: mockDiary[1], token }];
    if (match("term3id")) return [200, { data: mockDiary[2], token }];
    if (match("term4id")) return [200, { data: mockDiary[3], token }];
  });
  mock.onGet(new RegExp("subject")).reply(200, mockSubject);
};

if (isMock) {
  await installMockApi(api);
}
