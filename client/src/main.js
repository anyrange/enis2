import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";
import VWave from "v-wave";

const app = createApp(App);

app.use(store).use(router).use(VWave).mount("#app");
