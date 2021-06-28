import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";
import VWave from "v-wave";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { clickOutside } from "./directives";

import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";
import { Quasar } from "quasar";
import { Notify, Loading, Dark } from "quasar";

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    Dark,
  },
});

app.directive("click-outside", clickOutside);

app
  .use(store)
  .use(router)
  .use(VWave)
  .use(Toast)
  .mount("#app");
