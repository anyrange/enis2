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
    console.log(credentials);

    return api
      .get(
        `login?city=${city}&login=${credentials.login}&password=${credentials.password}&captchaInput=${credentials.captchaInput}`
      )
      .then((response) => response.data);
  },
  terms() {
    return api
      .get(`dashboard/terms?city=${getCity()}`)
      .then((response) => response.data);
  },
  diary(term) {
    return api
      .get(`dashboard/terms/${term}?city=${getCity()}`)
      .then((response) => response.data);
  },
  subject(journalId, evalIdSOR, evalIdSOCH) {
    const fetchedData = (route) => api.get(route);
    const promises = [
      `dashboard/info?journalId=${journalId}&evalId=${evalIdSOR}&city=${getCity()}`,
      `dashboard/info?journalId=${journalId}&evalId=${evalIdSOCH}&city=${getCity()}`,
    ].map(fetchedData);
    return Promise.all(promises).then((response) => response);
  },
};
