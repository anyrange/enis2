import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  withCredentials: true,
});

export default {
  login(credentials) {
    return api.post("login", credentials).then((response) => response.data);
  },
  deshboard() {
    return api.get("dashboard/current").then((response) => response);
  },
};
