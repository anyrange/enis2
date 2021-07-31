import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { clickOutside } from "./directives";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";
import VWave from "v-wave";

const app = createApp(App);

app.directive("click-outside", clickOutside);

app.use(store).use(router).use(VWave).mount("#app");
