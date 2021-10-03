import { createApp } from "vue";
import VWave from "v-wave";
import App from "./App.vue";
import "virtual:windi.css";
import "./assets/styles.css";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.use(VWave).use(store).use(router).mount("#app");
