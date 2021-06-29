import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VWave from "v-wave";
import { clickOutside } from "./directives";
import { notify } from "./notify";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";

const app = createApp(App);

import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";
import { Quasar } from "quasar";
import { Notify, Loading, Dark } from "quasar";
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
  .use(notify)
  .use(VWave)
  .mount("#app");
