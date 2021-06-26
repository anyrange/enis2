import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";
import VWave from "v-wave";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

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

app
  .use(store)
  .use(router)
  .use(VWave)
  .use(Toast, {
    position: POSITION.BOTTOM_LEFT,
  })
  .mount("#app");
