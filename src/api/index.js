import axios from "axios";
import store from "@/store";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

const getCity = () => {
  const city = store.getters["getCity"];
  return city.value;
};

export default {
  login(credentials, city) {
    return api
      .post(`login?city=${city}`, credentials)
      .then((response) => response.data);
  },
  deshboard() {
    return api
      .get(`dashboard/current?city=${getCity()}`)
      .then((response) => response);
  },
  getSubject(journalId, evalIdSOR, evalIdSOCH) {
    const fetchedData = (route) => api.get(route);
    const promises = [
      `dashboard/info?journalId=${journalId}&evalId=${evalIdSOR}&city=${getCity()}`,
      `dashboard/info?journalId=${journalId}&evalId=${evalIdSOCH}&city=${getCity()}`,
    ].map(fetchedData);
    return Promise.all(promises).then((response) => response);
  },
};
