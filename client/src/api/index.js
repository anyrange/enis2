import axios from "axios";
import { isMock, ENDPOINTS, SERVER_URL, DEFAULT_ERROR_MESSAGE } from "@/config";
import { useLoader, useAuth, useSettings } from "@/store";

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

const useStore = () => {
  const auth = useAuth();
  const loader = useLoader();
  const settings = useSettings();
  return { loader, auth, settings };
};

const setLoader = ({ status, endpoint }) => {
  const { loader } = useStore();
  loader.setLoader({ status, endpoint });
};

const getParams = () => {
  const { auth, settings } = useStore();
  return { city: settings.settings.school, token: auth.token };
};

api.interceptors.request.use(
  (config) => {
    const url = config.url;
    const endpoint = ENDPOINTS.find((e) => url.includes(e.endpoint)).name;
    const { token, city } = getParams();
    setLoader({ status: "loading", endpoint });
    config.headers.Authorization = `Bearer ${token}`;
    config.params = {
      ...config.params,
      city,
    };
    if (isMock) console.log(`🚀 endpoint: ${endpoint}, url: ${url}`);
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
    return response.data;
  },
  (error) => {
    setLoader({ status: "error", endpoint: null });
    error.response.data = error.response.data || {};
    error.response.data.message =
      error.response.data.message || DEFAULT_ERROR_MESSAGE;
    return Promise.reject(error);
  }
);

const createEndpoint = (name, id = "") => {
  const url = ENDPOINTS.find((e) => e.name === name).endpoint;
  return url + id;
};

export const checkHealth = () => {
  return api.get(createEndpoint("HEALTH_SMS"));
};

export const getCity = () => {
  return api.get(createEndpoint("CITY"), { timeout: 1500 });
};

export const login = (credentials = {}) => {
  return api.post(createEndpoint("LOGIN"), credentials);
};

export const refreshCaptcha = () => {
  return api.get(createEndpoint("REFRESH_CAPTCHA"));
};

export const getYears = () => {
  return api.get(createEndpoint("YEARS"));
};

export const getTerms = (yearId) => {
  return api.get(createEndpoint("TERMS", yearId));
};

export const getDiary = (termId) => {
  return api.get(createEndpoint("DIARY", termId));
};

export const getSubject = (journalId, evaluations) => {
  return api.get(createEndpoint("SUBJECT"), {
    params: { journalId, evaluations },
  });
};

export const getGrades = (yearID) => {
  return api.get(createEndpoint("GRADES"), { params: { yearID } });
};

const installMockApi = async (api) => {
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

  mock.onGet("city").reply(200, { city: "Pvl", region: "Pavlodar Region" });

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
