import { createApp } from "vue";
import VWave from "v-wave";
import App from "./App.vue";
import "virtual:windi.css";
import "./assets/styles.css";
import store from "./store";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const app = createApp(App);

app.use(VWave).use(store).mount("#app");
