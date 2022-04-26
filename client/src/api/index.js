import axios from "axios";
import { ENDPOINTS, SERVER_URL, DEFAULT_ERROR_MESSAGE } from "@/config";
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
    const { name } = ENDPOINTS.find((item) => url.includes(item.endpoint));
    const { token, city } = getParams();
    setLoader({ status: "loading", endpoint: name });
    config.headers.Authorization = `Bearer ${token}`;
    config.params = {
      ...config.params,
      city,
    };
    return config;
  },
  (error) => {
    setLoader({ status: "error", endpoint: null });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    setLoader({ status: "pending" });
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
