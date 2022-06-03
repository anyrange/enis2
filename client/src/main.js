import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import VWave from "v-wave";
import App from "./App.vue";
import "virtual:windi.css";
import "./assets/styles.css";

registerSW({ immediate: true });

const app = createApp(App);
const pinia = createPinia();

app.use(VWave).use(pinia).mount("#app");
